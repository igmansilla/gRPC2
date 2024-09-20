// Importa lit como módulos CommonJS
import { LitElement, html, css } from 'https://cdn.skypack.dev/lit';

class TiendasComponent extends LitElement {
  static get properties() {
    return {
      tiendas: { type: Array },
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.loadTiendas();
  }

  async loadTiendas() {
    try {
      const response = await fetch("/listTiendas");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      this.tiendas = (await response.json())?.tiendas;
      debugger
    } catch (error) {
      console.error("Error al cargar las tiendas:", error);
    }
  }

  static styles = css`
    :host {
      display: block;
      padding: 16px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th,
    td {
      padding: 0.8rem;
      border: 1px solid #ddd;
      text-align: left;
    }
    th {
      background-color: #f4f4f4;
    }
  `;

  render() {
    debugger
    return html`
      <h2>Lista de Tiendas</h2>
      ${this.tiendas?.length > 0
        ? html`
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Dirección</th>
                  <th>Ciudad</th>
                  <th>Provincia</th>
                  <th>Habilitada</th>
                  <th>Productos Asociados</th>
                </tr>
              </thead>
              <tbody>
                ${this.tiendas.map(
                  (tienda) => html`
                    <tr>
                      <td>${tienda.codigo}</td>
                      <td>${tienda.direccion}</td>
                      <td>${tienda.ciudad}</td>
                      <td>${tienda.provincia}</td>
                      <td
                        class="status ${tienda.habilitada
                          ? "enabled"
                          : "disabled"}"
                      >
                        ${tienda.habilitada ? "Habilitada" : "Deshabilitada"}
                      </td>
                      <td>${tienda.producto_ids.join(", ")}</td>
                    </tr>
                  `
                )}
              </tbody>
            </table>
          `
        : html`<p>Cargando tiendas...</p>`}
    `;
  }
}

customElements.define("lit-tiendas", TiendasComponent);
