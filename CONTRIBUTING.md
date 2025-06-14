# 🤝 Contribuir a ScopeJS - Guía para Rebeldes del Código 😎

> ¿Quieres hacer ScopeJS aún más genial? ¡Perfecto! Aquí te explico cómo unirte a la revolución sin que nadie salga herido.

¡Hola, futuro héroe del código! 👋 Si estás leyendo esto es porque:

1. **Te gusta ScopeJS** (obvio, tienes buen gusto)
2. **Quieres mejorarlo** (eres una persona de bien)
3. **Te aburres** (también válido, al menos será productivo)
4. **Te perdiste** (pasa, pero ya que estás aquí...)

## 🎯 Tipos de Contribuciones que Nos Enamoran

### 🐛 Reportar Bugs (Sin Drama, Por Favor)

¿Encontraste algo roto? ¡No entres en pánico! Sigue estos simples pasos:

1. **Antes de gritar "¡BUG!"** - Revisa si alguien ya lo reportó
2. **Usa el template de issues** - Sí, ese que nadie lee pero que está ahí por algo
3. **Sé específico** - "No funciona" no es útil. "Explota cuando hago X en Y navegador" sí lo es
4. **Incluye código** - Un ejemplo que reproduzca el problema vale más que mil palabras
5. **No seas dramático** - No, no es el fin del mundo. Probablemente.

### ✨ Proponer Features (Dream Big!)

¿Tienes una idea que va a cambiar el mundo? ¡Queremos escucharla!

- **Abre un issue** con el tag `enhancement`
- **Explica tu caso de uso** - ¿Para qué sirve en la vida real?
- **Sé realista** - No, no vamos a hacer que ScopeJS prepare café
- **Acepta feedback** - Puede que tu idea sea genial... o no tanto

### 🔧 Contribuir Código (Here We Go!)

Aquí es donde la cosa se pone seria (pero divertida):

## 🚀 Proceso de Contribución Paso a Paso

### 1. Fork & Clone (Lo Básico)

```bash
# Fork el repo en GitHub (botón de arriba a la derecha)
git clone https://github.com/TU-USUARIO/ScopeJS.git
cd ScopeJS
```

### 2. Crear una Rama (Naming is Hard)

```bash
# Usa nombres descriptivos, por favor
git checkout -b feature/modal-con-superpoderes
git checkout -b fix/bug-que-me-vuelve-loco
git checkout -b docs/explicar-como-funciona-la-magia
```

**Convenciones de nombres:**

- `feature/` - Para nuevas funcionalidades
- `fix/` - Para arreglar bugs
- `docs/` - Para documentación
- `refactor/` - Para limpiar código
- `test/` - Para añadir tests

### 3. Desarrollar como un Pro

#### 📏 Estándares de Código (No Negociables)

```javascript
// ✅ Bien - Nombres claros y descriptivos
function createAwesomeComponent(options) {
  const componentInstance = new ComponentFactory(options);
  return componentInstance;
}

// ❌ Mal - ¿Qué diablos hace esto?
function x(o) {
  const c = new CF(o);
  return c;
}
```

**Reglas de Oro:**

- **Usa nombres descriptivos** - Tu yo del futuro te lo agradecerá
- **Comenta el código complejo** - Si tardaste 2 horas en entenderlo, otros también
- **Mantén funciones pequeñas** - Si no cabe en la pantalla, probablemente es muy grande
- **Sigue el estilo existente** - No seas el rebelde que usa tabs en un proyecto de spaces

#### 🧪 Testing (Porque Nadie Es Perfecto)

```javascript
// Ejemplo de test que queremos ver
describe("Component Creation", () => {
  it("should create component without exploding", () => {
    const component = Component({
      controller: class {
        constructor() {
          this.test = true;
        }
      },
      render() {
        return "<div>Test</div>";
      },
    });

    expect(component).toBeDefined();
    expect(component.render).toBeInstanceOf(Function);
  });
});
```

- **Escribe tests para tu código** - Especialmente si tocas funcionalidades críticas
- **Tests descriptivos** - El nombre del test debe explicar qué hace
- **Casos edge** - Prueba los escenarios raros donde todo se rompe

### 4. Commit como un Artista

```bash
# ✅ Commits que nos gustan
git commit -m "feat: add support for nested modals"
git commit -m "fix: resolve memory leak in component cleanup"
git commit -m "docs: update examples for Router usage"

# ❌ Commits que nos dan dolor de cabeza
git commit -m "stuff"
git commit -m "fix things"
git commit -m "idk what im doing"
```

**Formato de commits:**

- `feat:` - Nueva funcionalidad
- `fix:` - Arreglo de bug
- `docs:` - Documentación
- `style:` - Formateo, punto y coma faltante
- `refactor:` - Cambio de código que no arregla bug ni añade feature
- `test:` - Añadir tests
- `chore:` - Cambios en build, herramientas, etc.

### 5. Push & Pull Request (El Gran Momento)

```bash
git push origin feature/tu-rama-genial
```

Luego ve a GitHub y crea el Pull Request. **Pro tips:**

- **Título descriptivo** - "Update stuff" no cuenta
- **Descripción detallada** - Explica qué hace, por qué lo hace, cómo lo probaste
- **Screenshots** - Si cambias UI, muéstranos cómo se ve
- **Tests** - Asegúrate de que todo pase

## 📋 Template de Pull Request

```markdown
## ¿Qué hace este PR?

<!-- Describe brevemente los cambios -->

## ¿Por qué es necesario?

<!-- Explica el problema que resuelve o la funcionalidad que añade -->

## ¿Cómo se prueba?

<!-- Pasos para probar los cambios -->

## Screenshots (si aplica)

<!-- Imágenes del antes y después -->

## Checklist

- [ ] He probado los cambios localmente
- [ ] He añadido/actualizado tests si es necesario
- [ ] He actualizado la documentación si es necesario
- [ ] El código sigue los estándares del proyecto
- [ ] No he roto funcionalidades existentes (espero)
```

## 🎨 Guías de Estilo Específicas

### JavaScript

```javascript
// Usamos ES6+ como gente civilizada
const awesomeFunction = (param) => {
  return param.map((item) => item.value);
};

// Destructuring cuando tiene sentido
const { Component, Modal } = ScopeJS;

// Template literals para strings complejos
const html = `
    <div class="awesome-component">
        <h1>${title}</h1>
        <p>${description}</p>
    </div>
`;
```

### CSS (En componentes)

```css
/* Usa clases semánticas */
.component-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Evita !important como si fuera ajo */
.button {
  background: #9333ea;
  color: white;
  /* NOT: color: white !important; */
}
```

### Documentación

- **Ejemplos reales** - Código que realmente funciona
- **Explica el "por qué"** - No solo el "cómo"
- **Mantén consistencia** - Mismo tono y formato
- **Emoji con moderación** - Somos divertidos, no un circo

## 🚫 Qué NO Hacer (Para Evitar Dramas)

### ❌ Cambios Destructivos

- No rompas APIs existentes sin discutir primero
- No elimines funcionalidades sin deprecarlas antes
- No cambies comportamientos fundamentales por capricho

### ❌ Código Problemático

```javascript
// NO hagas esto
eval(userInput);
document.write('<script>alert("hack")</script>');
// Seriously, don't.
```

### ❌ Pull Requests Caóticos

- No mezcles múltiples features en un PR
- No subas cambios sin probar
- No ignores los comentarios del review

## 🎉 Proceso de Review (No Muerden)

1. **Automático** - Los tests deben pasar (obvio)
2. **Humano** - Alguien revisará tu código
3. **Feedback** - Puede que pidamos cambios (no es personal)
4. **Merge** - ¡Tu código forma parte de ScopeJS! 🎊

### Durante el Review

- **Sé receptivo** - Los comentarios son para mejorar, no para atacar
- **Pregunta si no entiendes** - Mejor preguntar que asumir
- **Defiende tus decisiones** - Si tienes razones sólidas, compártelas
- **Aprende** - Cada review es una oportunidad de crecer

## 🏆 Reconocimientos

Todos los contribuidores aparecen en:

- **README.md** - Hall of Fame
- **Changelog** - Créditos por feature/fix
- **Nuestros corazones** - Lo más importante ❤️

## 🆘 ¿Necesitas Ayuda?

- **Issues** - Para preguntas técnicas
- **Discussions** - Para charlar sobre ideas
- **Email** - Para cosas súper secretas
- **Señales de humo** - También funciona (a veces)

## 🎊 Palabras Finales

Contribuir a ScopeJS debería ser:

- **Divertido** - Si no te diviertes, algo estamos haciendo mal
- **Educativo** - Todos aprendemos algo
- **Colaborativo** - Juntos somos más fuertes
- **Respetuoso** - Tratamos a todos como nos gustaría ser tratados

¿Listo para hacer historia? ¡Vamos a programar! 🚀

---

_P.D.: Si llegaste hasta aquí, ya eres parte de la familia ScopeJS. Welcome aboard! 🎉_
