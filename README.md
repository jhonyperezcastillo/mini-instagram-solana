# 📸 Mini Instagram - Solana dApp

Este proyecto es una mini aplicación descentralizada (dApp) construida sobre la blockchain de **Solana** usando el framework **Anchor**. Es una red social básica donde los usuarios pueden **publicar mensajes** que se almacenan en la blockchain utilizando una **PDA (Program Derived Address)**. El frontend está construido con **Next.js + TypeScript** e integrado con wallets como Phantom.

---

## 📦 Estructura del Proyecto

```
mini-instagram/
│
├── programs/mini-instagram/     # Programa Anchor en Rust
├── frontend/                    # Frontend en Next.js
└── README.md                    # Este archivo
```

---

## ⚙️ ¿Cómo funciona?

1. El programa Anchor permite a los usuarios crear publicaciones mediante el método `create_post`, almacenándolas en cuentas derivadas por PDA.
2. Cada publicación incluye:
   - Dirección del autor (wallet)
   - Contenido del post (máximo ~280 caracteres)
3. El frontend permite conectarse con la wallet, escribir un mensaje y publicarlo en Devnet.
4. Cada transacción es visible en Solana Explorer.

---

## 🚀 Enlace desplegado

- Frontend en Vercel: https://mini-instagram-solana-ss7z.vercel.app/
- Última transacción de ejemplo:  
  https://explorer.solana.com/tx/5gfjPf9bPmA1NWQJaLwrNMDDGE9EsKVzYc9NFw9TYfgGCx9o896tAWj8nhVmB8JF9qQBS1ocNdd6btyRQ1BGCAsF?cluster=devnet

---

## 📜 Instrucciones para correr localmente

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd mini-instagram
```

### 2. Construir y testear el programa Anchor

```bash
cd programs/mini-instagram
anchor build
anchor test
```

✅ El programa usa una PDA derivada con seeds: `[b"post", author.key(), content.as_bytes()]`

### 3. Correr el frontend

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:3000` para usar la dApp.

---

## ✅ Requisitos cumplidos

- [x] Programa Anchor desplegado en Devnet ✅  
- [x] Uso de PDA (`findProgramAddress`) ✅  
- [x] Frontend funcional ✅  
- [x] Prueba en TypeScript (✅ en desarrollo local, archivo `post.ts`)  
- [x] Diseño amigable con Tailwind ✅  
- [x] Interacción con Solana y envío de transacciones confirmadas ✅  
- [x] Visualización en Solana Explorer ✅

---

## ✍️ Autor

- Jhony Perez  
- Fecha de entrega: 22/03/2025

---

## 📬 Contacto

Para consultas o feedback: jhonyperez0375
