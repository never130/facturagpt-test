let title1 = (text) => {
    return `
    <h1>
        ${text}
    </h1>
    `
}

let title2 = (text) => {
    return `
    <h2>
        ${text}
    </h2>
    `
}

let title3 = (text) => {
    return `
    <h3>
        ${text}
    </h3>
    `
}

let title4 = (text) => {
    return `
    <h4>
        ${text}
    </h4>
    `
}

let title5 = (text) => {
    return `
    <h5>
        ${text}
    </h5>
    `
}

let title6 = (text) => {
    return `
    <h6>
        ${text}
    </h6>
    `
}

let paragraph = (text) => {
    return `
    <p>
        ${text}
    </p>
    `
}

let strong = (text) => {
    return `
    <strong>
        ${text}
    </strong>
    `
}

let em = (text) => {
    return `
    <em>
        ${text}
    </em>
    `
}

let code = (text) => {
    return `
    <code>
        ${text}
    </code>
    `
}

let pre = (text) => {
    return `
    <pre>
        ${text}
    </pre>
    `
}

let blockquote = (text) => {
    return `
    <blockquote>
        ${text}
    </blockquote>
    `
}

let ul = (items) => {
    const listItems = items.map(item => `<li>${item}</li>`).join('\n        ')
    return `
    <ul>
        ${listItems}
    </ul>
    `
}

let ol = (items) => {
    const listItems = items.map(item => `<li>${item}</li>`).join('\n        ')
    return `
    <ol>
        ${listItems}
    </ol>
    `
}

let li = (text) => {
    return `
    <li>
        ${text}
    </li>
    `
}

let a = (text, href) => {
    return `
    <a href="${href}">
        ${text}
    </a>
    `
}

let img = (src, alt = '') => {
    return `
    <img src="${src}" alt="${alt}" />
    `
}

let div = (content) => {
    return `
    <div>
        ${content}
    </div>
    `
}

let span = (text) => {
    return `
    <span>
        ${text}
    </span>
    `
}

let table = (headers, rows) => {
    const headerRow = headers.map(header => `<th>${header}</th>`).join('\n            ')
    const tableRows = rows.map(row => {
        const cells = row.map(cell => `<td>${cell}</td>`).join('\n                ')
        return `
            <tr>
                ${cells}
            </tr>`
    }).join('\n')
    
    return `
    <table>
        <thead>
            <tr>
                ${headerRow}
            </tr>
        </thead>
        <tbody>
            ${tableRows}
        </tbody>
    </table>
    `
}

let hr = () => {
    return `
    <hr />
    `
}

let br = () => {
    return `
    <br />
    `
}

let section = (content) => {
    return `
    <section>
        ${content}
    </section>
    `
}

let article = (content) => {
    return `
    <article>
        ${content}
    </article>
    `
}

let aside = (content) => {
    return `
    <aside>
        ${content}
    </aside>
    `
}

let header = (content) => {
    return `
    <header>
        ${content}
    </header>
    `
}

let footer = (content) => {
    return `
    <footer>
        ${content}
    </footer>
    `
}

let nav = (content) => {
    return `
    <nav>
        ${content}
    </nav>
    `
}

let main = (content) => {
    return `
    <main>
        ${content}
    </main>
    `
}

let form = (content, action = '', method = 'POST') => {
    return `
    <form action="${action}" method="${method}">
        ${content}
    </form>
    `
}

let input = (type = 'text', name = '', placeholder = '', value = '') => {
    return `
    <input type="${type}" name="${name}" placeholder="${placeholder}" value="${value}" />
    `
}

let textarea = (name = '', placeholder = '', rows = 4, cols = 50) => {
    return `
    <textarea name="${name}" placeholder="${placeholder}" rows="${rows}" cols="${cols}"></textarea>
    `
}

let button = (text, type = 'button') => {
    return `
    <button type="${type}">
        ${text}
    </button>
    `
}

let label = (text, forAttr = '') => {
    return `
    <label for="${forAttr}">
        ${text}
    </label>
    `
}

let select = (options, name = '') => {
    const optionElements = options.map(option => `<option value="${option.value}">${option.text}</option>`).join('\n        ')
    return `
    <select name="${name}">
        ${optionElements}
    </select>
    `
}

let option = (text, value = '') => {
    return `
    <option value="${value}">
        ${text}
    </option>
    `
}

module.exports = {
    title1,
    title2,
    title3,
    title4,
    title5,
    title6,
    paragraph,
    strong,
    em,
    code,
    pre,
    blockquote,
    ul,
    ol,
    li,
    a,
    img,
    div,
    span,
    table,
    hr,
    br,
    section,
    article,
    aside,
    header,
    footer,
    nav,
    main,
    form,
    input,
    textarea,
    button,
    label,
    select,
    option
}

