// Importa lit como módulos CommonJS
import { LitElement, html, css } from 'https://cdn.skypack.dev/lit';

class UsuariosComponent extends LitElement {
  static get properties() {
    return {
      usuarios: { type: Array },
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.loadUsuarios();
  }

  async loadUsuarios() {
    try {
      const response = await fetch("/listUsuarios");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      this.usuarios = (await response.json())?.usuarios;
    } catch (error) {
      console.error("Error al cargar los usuarios:", error);
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
      <h2>Lista de Usuarios</h2>
      ${this.usuarios?.length > 0
        ? html`
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre de Usuario</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Tienda ID</th>
                  <th>Habilitado</th>
                </tr>
              </thead>
              <tbody>
                ${this.usuarios.map(
                  (usuario) => html`
                    <tr>
                      <td>${usuario.id}</td>
                      <td>${usuario.nombreUsuario}</td>
                      <td>${usuario.nombre}</td>
                      <td>${usuario.apellido}</td>
                      <td>${usuario.tienda_id}</td>
                      <td>${usuario.habilitado ? 'Sí' : 'No'}</td>
                    </tr>
                  `
                )}
              </tbody>
            </table>
          `
        : html`<p>Cargando usuarios...</p>`}
    `;
  }
}

customElements.define("lit-usuarios", UsuariosComponent);
