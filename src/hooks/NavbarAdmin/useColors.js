
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { defaultColor, setTheme, setThemeColor } from "../../slices/themeSlices";
import { getVariable, createVariable } from "../../actions/user";

const fallbackColor = 'rgba(139, 139, 139, 1)';
const THEME_SETTINGS_CATEGORY = "themeSettings";


export default function useColors() {
  const { theme, themeColor } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const [presetColors, setPresetColors] = useState([fallbackColor]);
  const [secondaryColor, setSecondaryColor] = useState(fallbackColor);
  const [loading, setLoading] = useState(true);

  // Load themeSettings from backend on mount
  useEffect(() => {
    async function loadThemeSettingsFromDB() {
      setLoading(true);
      try {
        const res = await dispatch(getVariable({ type: THEME_SETTINGS_CATEGORY, search: "" }));
        let loadedPresetColors = [];
        let loadedThemeColor = defaultColor;
        let loadedTheme = "light";
        if (res?.payload?.data?.length > 0 && typeof res.payload.data[0]?.value === "object") {
          const value = res.payload.data[0].value;
          if (Array.isArray(value.presetColors)) {
            loadedPresetColors = value.presetColors;
          }
          if (typeof value.themeColor === "string") {
            loadedThemeColor = value.themeColor;
          }
          if (typeof value.theme === "string") {
            loadedTheme = value.theme;
          }
        }
        setPresetColors(loadedPresetColors);
        // secondaryColor is always the last of presetColors or fallback
        const loadedSecondaryColor = loadedPresetColors.length > 0 ? loadedPresetColors[loadedPresetColors.length - 1] : fallbackColor;
        
        setSecondaryColor(loadedSecondaryColor);
        // Update global state for themeColor and theme if different
        if (loadedThemeColor && loadedThemeColor !== themeColor) {
          dispatch(setThemeColor(loadedThemeColor));
          console.log("jjj set themeColor", loadedThemeColor);
        }
        if (loadedTheme && loadedTheme !== theme) {
          dispatch(setTheme(loadedTheme));
          console.log("jjj set theme", loadedTheme);
        }
      } catch (e) {
        console.log("jjj error loading themeSettings", e);
      }
      setLoading(false);
    }
    loadThemeSettingsFromDB();
  }, []);

  // Sync themeSettings in DB when presetColors, themeColor or theme change
  useEffect(() => {

    if (loading) return;
    async function saveThemeSettings() {
      try {
        const themeConfiguration = {
          presetColors,
          themeColor,
          theme
        };
        const res = await dispatch(createVariable({ variableData: {
          title: "themeSettings",
          category: THEME_SETTINGS_CATEGORY,
          value: themeConfiguration
        }}));
      } catch (e) {
        console.error("error createVariable themeSettings", e);
      }
    }
    saveThemeSettings();
  }, [presetColors, themeColor, theme]);

  // Keep secondaryColor updated when themeColor changes
  useEffect(() => {
    if (loading) return;
    const lastPresetColorOrFallback = presetColors[presetColors.length - 1] || fallbackColor;
    const updatedSecondaryColor = themeColor === defaultColor
      ? lastPresetColorOrFallback
      : themeColor;
    setSecondaryColor(updatedSecondaryColor);
  }, [themeColor]);


  const updatePresetColors = (newColors) => {
    
    setPresetColors((prevColors) => {
      const newColor = newColors[newColors.length - 1];
      if (prevColors.includes(newColor)) return prevColors;
      
      let updatedColors = [...prevColors, newColor];
      // Limit to last 21 colors
      if (updatedColors.length > 21) {
        updatedColors = updatedColors.slice(-21);
      }
      
      return updatedColors;
    });
  };

  return {
    presetColors,
    updatePresetColors,
    secondaryColor,
    setSecondaryColor,
    loading,
    theme,
  };
}
