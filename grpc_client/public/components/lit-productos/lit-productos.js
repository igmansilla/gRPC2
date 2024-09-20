// Importa lit como módulos CommonJS
import { LitElement, html, css } from 'https://cdn.skypack.dev/lit';

class ProductosComponent extends LitElement {
  static get properties() {
    return {
      productos: { type: Array },
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.loadProductos();
  }

  async loadProductos() {
    try {
      const response = await fetch("/listProductos");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      this.productos = (await response.json())?.productos;
    } catch (error) {
      console.error("Error al cargar los productos:", error);
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
    return html`
      <h2>Lista de Productos</h2>
      ${this.productos?.length > 0
        ? html`
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Código</th>
                  <th>Talle</th>
                  <th>Foto</th>
                  <th>Color</th>
                  <th>Tiendas Asociadas</th>
                </tr>
              </thead>
              <tbody>
                ${this.productos.map(
                  (producto) => html`
                    <tr>
                      <td>${producto.nombre}</td>
                      <td>${producto.codigo}</td>
                      <td>${producto.talle || "N/A"}</td>
                      <td>
                        ${producto.foto
                          ? html`<img src="${producto.foto}" alt="Foto" width="50"/>`
                          : "No disponible"}
                      </td>
                      <td>${producto.color || "N/A"}</td>
                      <td>${producto.tienda_ids.join(", ")}</td>
                    </tr>
                  `
                )}
              </tbody>
            </table>
          `
        : html`<p>Cargando productos...</p>`}
    `;
  }
}

customElements.define("lit-productos", ProductosComponent);
