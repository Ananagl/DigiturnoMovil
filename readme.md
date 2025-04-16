# 🧠 Proyecto Base - Node.js + Express + TypeScript + Angular/Ionic

Este repositorio contiene un proyecto con backend en Node.js y frontend en Angular/Ionic.

---

## 📦 Requisitos previos

Asegúrate de tener instalado:

- Node.js `v22.13.1` posibles versiones 
- npm `v11.1.0`
- MySQL (para la base de datos)

Verifica versiones:
```bash
node -v
npm -v
```
⚙️ Backend (Node.js + Express + TypeScript)
1. Instalación de dependencias
```bash
npm install express mysql2 cors dotenv
npm install --save-dev typescript ts-node @types/node @types/express @types/cors
```
2. Inicializar TypeScript
```bash
npx tsc --init
```
3. Ejecutar servidor (ejemplo si usas ts-node)
```bash
npx ts-node src/index.ts
```
💻 Frontend (Angular + Ionic)
1. Instalar herramientas globales
```bash
npm install -g @angular/cli
npm install -g @ionic/cli
```
2. Iniciar el servidor de desarrollo
```bash
ionic serve
```
