# PrivyCredit

PrivyCredit es la puerta de entrada para ofrecer crédito confiable sobre señales on-chain. Permitimos que los usuarios prueben su solvencia sin entregar datos sensibles y brindamos a los partners un flujo claro, medible y con identidad propia.

> Home
![PrivyCredit home](assets/privycredit-home.png)

> PrivyCredit in Action
![PrivyCredit Hero](assets/privycredit-hero.png)


## Propuesta
- **Confianza inmediata:** pruebas selladas que se anclan en Scroll, listas para que bancos y fintechs las verifiquen.
- **Experiencia cuidada:** guía paso a paso (conectar, analizar, compartir) que reduce fricción y comunica valor en todo momento.
- **Activación comercial:** módulos de checklist, simulador y recordatorios mantienen al prospecto en tu embudo incluso si aún no califica.
- **Infra lista para alianzas:** Supabase + AppKit + wagmi facilitan integrar wallets, datos y contratos en un mismo stack.

## Flujo 
1. Usuario otorga consentimiento para el análisis.
2. El sistema analiza activity on-chain, genera bandas y sella la prueba.
3. El resultado se presenta con mensajes accionables; si califica puede compartir un enlace verificable con terceros.
4. Lado verificador, se consulta la prueba contra el contrato y la metadata persistida en Supabase.

### Diagrama de Flujo
```mermaid
flowchart LR
    A[Usuario abre PrivyCredit] --> B{Wallet conectada?}
    B -- No --> C[Modal Reown para conectar y otorgar consentimientos]
    B -- Sí --> D[Analizar señales on-chain]
    D --> E[Generar prueba sellada y anclar en Scroll]
    E --> F{Resultado}
    F -- Apto --> G[Mostrar bandas + CTA Compartir]
    F -- Casi --> H[Mostrar checklist y simulador]
    G --> I[Generar enlace verificable]
    I --> J[Partner verifica contra contrato + Supabase]
```

## Componentes Clave
| Capa | Valor para negocio |
| --- | --- |
| **Experiencia (React + Tailwind)** | UI responsiva lista para campañas, soporta múltiples pantallas y mensajes marketing-ready. |
| **Orquestación Web3 (AppKit + wagmi + viem)** | Conexión segura a wallets Scroll y ejecución de `submitProof` sin exponer lógica sensible. |
| **Datos (Supabase)** | Persistencia de pruebas, mejoras y recordatorios para nutrir CRM y seguimiento. |
| **Blockchain (Scroll Mainnet + Sepolia)** | Registro inmutable que respalda cada prueba con un hash verificable por socios. |

## Lanzamiento Rápido
1. **Requisitos:** Node 20+, npm 10+, wallet compatible con Scroll.
2. **Instalación:** `npm install` y copia `.env.example` a `.env.local` (todas las claves deben iniciar con `VITE_`).
3. **Configura** RPC de Scroll, dirección del contrato y credenciales de Supabase. Define `ANCHOR_PRIVATE_KEY` (la llave del owner del contrato) para poder anclar epochs desde scripts locales.
4. **Ejecución:** `npm run dev` para la demo interna; `npm run build` + `npm run preview` para QA previo a campañas.

## Operación on-chain
- Antes de generar pruebas en una red, ancla el root del epoch activo con `pnpm run anchor:root -- --chain=mainnet --root=0x…`. El epoch por defecto es el día actual (`Math.floor(Date.now() / día)`), pero puedes especificar otro usando `--epoch=20439`.
- Verifica qué redes tienen root anclado ejecutando `pnpm run check:epoch`. El script consulta los contratos de Scroll Mainnet y Sepolia utilizando los RPC por defecto y avisa si falta registrar el root.
- Si el root no existe para un epoch, las llamadas a `submitProof` revertirán con `epoch not anchored`. Mantén un job (cron/servicio) que ejecute el script de anclaje antes de abrir el flujo a usuarios en producción.
