class DataTable extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ["data", "font"];
  }

  attributeChangedCallback() {
    this.render();
  }

  get parsedData() {
    try {
      const raw = this.getAttribute("data");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Error parsing data-table `data` attribute:", e);
      return [];
    }
  }

  render() {
    const data = this.parsedData;
    if (!Array.isArray(data) || data.length === 0) {
      this.shadowRoot.innerHTML = `<p>No hay datos para mostrar.</p>`;
      return;
    }

    const style = `
      table {
        width: 100%;
        border-collapse: collapse;
        font-family: ${this.getAttribute("font") || "Arial, sans-serif"};
      }
      thead {
        background-color: #333;
        color: #fff;
        text-transform: uppercase;
      }
      th, td {
        border: 1px solid #ccc;
        padding: 0.5em;
        text-align: left;
      }
      tbody tr:nth-child(even) {
        background-color: #f2f2f2;
      }
    `;

    const headers = Object.keys(data[0]);
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Encabezado
    const headerRow = document.createElement("tr");
    headers.forEach((h) => {
      const th = document.createElement("th");
      th.textContent = h.charAt(0).toUpperCase() + h.slice(1);
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Filas de datos
    data.forEach((row) => {
      const tr = document.createElement("tr");
      headers.forEach((h) => {
        const td = document.createElement("td");
        td.innerHTML = row[h];
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    // Ensamblar
    const styleTag = document.createElement("style");
    styleTag.textContent = style;

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(styleTag);
    this.shadowRoot.appendChild(table);
    table.appendChild(thead);
    table.appendChild(tbody);
  }
}

customElements.define("data-table", DataTable);
