# Guía de Testing

## Configuración

El proyecto utiliza Jest y React Testing Library para las pruebas unitarias e integración.

### Dependencias de Testing

```json
{
  "@testing-library/react": "^13.4.0",
  "@testing-library/jest-dom": "^5.16.5",
  "@testing-library/user-event": "^14.4.3",
  "jest": "^29.7.0",
  "jest-environment-jsdom": "^29.7.0"
}
```

## Scripts Disponibles

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests para CI
npm run test:ci
```

## Estructura de Tests

```
src/
├── components/
│   └── __tests__/
│       ├── Component.test.tsx
│       └── ...
├── hooks/
│   └── __tests__/
│       ├── useHook.test.ts
│       └── ...
├── lib/
│   └── __tests__/
│       ├── utils.test.ts
│       └── ...
└── ...
```

## Convenciones de Testing

### Nomenclatura

- Archivos de test: `*.test.tsx` o `*.test.ts`
- Directorio: `__tests__/` dentro de cada módulo
- Describe blocks: Nombre del componente/función
- Test cases: Descripción clara del comportamiento

### Ejemplo de Test

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from '../MyComponent'

describe('MyComponent', () => {
  it('renders with correct text', () => {
    render(<MyComponent text="Hello" />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    
    render(<MyComponent onClick={handleClick} />)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## Mocks Configurados

### Next.js Router
```javascript
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn()
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  }
}))
```

### Window APIs
- `window.matchMedia`
- `IntersectionObserver`
- `ResizeObserver`
- `localStorage`
- `navigator.vibrate`
- `fetch`

## Coverage

### Umbrales de Coverage

```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70
  }
}
```

### Archivos Excluidos

- `*.d.ts` - Archivos de definición de tipos
- `*.stories.*` - Archivos de Storybook
- `*.test.*` - Archivos de test
- `*.spec.*` - Archivos de especificación

## Estrategias de Testing

### Componentes UI

1. **Renderizado**: Verificar que el componente se renderiza correctamente
2. **Props**: Verificar que las props se aplican correctamente
3. **Estados**: Verificar cambios de estado
4. **Eventos**: Verificar manejo de eventos del usuario
5. **Accesibilidad**: Verificar atributos ARIA y roles

### Hooks Personalizados

1. **Estado inicial**: Verificar valores iniciales
2. **Actualizaciones**: Verificar cambios de estado
3. **Efectos secundarios**: Verificar llamadas a APIs, localStorage, etc.
4. **Cleanup**: Verificar limpieza de recursos

### Servicios y Utilidades

1. **Casos normales**: Verificar funcionamiento con datos válidos
2. **Casos edge**: Verificar manejo de casos límite
3. **Errores**: Verificar manejo de errores
4. **Validaciones**: Verificar validaciones de entrada

## Mejores Prácticas

### Testing Library

- Usar queries por rol y texto visible al usuario
- Evitar queries por clases CSS o IDs
- Usar `userEvent` para simular interacciones
- Usar `waitFor` para operaciones asíncronas

### Jest

- Usar `describe` para agrupar tests relacionados
- Usar `beforeEach`/`afterEach` para setup/cleanup
- Usar `jest.fn()` para mocks
- Usar matchers específicos (`toBeInTheDocument`, `toHaveClass`, etc.)

### Organización

- Un archivo de test por componente/hook/utilidad
- Tests específicos y enfocados
- Setup compartido en `jest.setup.js`
- Mocks reutilizables

## CI/CD

### GitHub Actions

El pipeline de CI ejecuta:

1. Linting con ESLint
2. Tests unitarios con Jest
3. Coverage report
4. Build de la aplicación

### Coverage Reports

- Reportes locales en `coverage/`
- Integración con Codecov para PRs
- Umbrales de coverage configurados

## Debugging Tests

### Comandos Útiles

```bash
# Ejecutar un test específico
npm test -- --testNamePattern="MyComponent"

# Ejecutar tests en un archivo específico
npm test -- MyComponent.test.tsx

# Modo debug
npm test -- --verbose

# Ver coverage detallado
npm run test:coverage -- --verbose
```

### Debugging en VSCode

1. Instalar extensión Jest
2. Configurar launch.json para debugging
3. Usar breakpoints en tests

## Recursos

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)