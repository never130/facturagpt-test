import { configureStore } from '@reduxjs/toolkit';
import menuAutomateSlices from '../slices/menuAutomateSlices';
import automateSlices from '../slices/automateSlices';
import scalewaySlices from '../slices/scalewaySlices';
import contactsSlices from '../slices/contactsSlices';
import assetsSlices from '../slices/assetsSlices';
import notificationsSlices from '../slices/notificationsSlices';
import userSlices from '../slices/userSlices';
import docsSlices from '../slices/docsSlices';
import chatSlices from '../slices/chatSlices';
import agentsSlices from '../slices/agentSlices';
import variableSlice from '../slices/variableSlice';
import paginationSlices from '../slices/paginationSlices';
import themeSlices from '../slices/themeSlices';
import dashboardSlice from '../slices/dashboardSlices';
import newsSlice from '../slices/newsSlices';
import qrCodeSlice from '../slices/qrCodeSlice';
import calendarSlice from '../slices/calendarSlices';
import kanbanSlice from '../slices/kanbanSlices';
import workspaceSlice from '../slices/workspaces';

const store = configureStore({
  reducer: {

    menuAutomate: menuAutomateSlices,
    automate: automateSlices,
    scaleway: scalewaySlices,
    contacts: contactsSlices,
    assets: assetsSlices,
    notifications: notificationsSlices,
    user: userSlices,
    chat: chatSlices,
    docs: docsSlices,
    agents: agentsSlices,
    variables: variableSlice,
    pagination: paginationSlices,
    theme: themeSlices,
    dashboard: dashboardSlice,
    news: newsSlice,
    qrCode: qrCodeSlice,
    calendar: calendarSlice,
    kanban: kanbanSlice,
    workspace: workspaceSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
