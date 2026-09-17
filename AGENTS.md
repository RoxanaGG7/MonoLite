# Política de commits — MonoLite

Este repo es privado, pero todo lo que se commitea puede publicarse por error.

## Regla 1: No commitear la receta

Jamás se commitea nada que revele planes, ideas, procesos clave o documentos de
diseño que hagan único al producto. El código de desarrollo y sus artefactos
técnicos, sí. La estrategia, no.

Todo documento estratégico vive en `Docs-Internal/` (ignorado por git,
prohibido commitear) o fuera del repo.

## Regla 2: Docs-Internal es intocable para git

La carpeta `Docs-Internal/` está en `.gitignore`. Nunca forzar su inclusión
(`git add -f` prohibido), nunca mover su contenido fuera sin autorización
explícita de Roxana.

## Regla 3: Documentos no-commiteables

Formatos de documento (posibles planes, ideas, procesos) quedan fuera del
control de versiones salvo decisión explícita contraria:

- `*.pdf`, `*.docx`, `*.pptx`, `*.xlsx`

Si algún fixture de desarrollo genuinamente necesita uno de estos formatos,
se decide caso a caso y se fuerza de forma explícita y documentada.

## Regla 4: Antes de cada commit

- `git status` y `git diff --staged` antes de confirmar
- Si aparece algo que no sea código/desarrollo, no se commitea
- Ante duda, preguntar antes de commitear

## Regla 5: Git remoto es territorio de Roxana

- **Pull Requests: solo los crea Roxana.** Nunca abrir un PR, ni con `gh`, ni por ningún medio.
- **Push: solo con autorización explícita y puntual** de Roxana en esa
  solicitud concreta. Un "sí" vale para ese push, no para los siguientes.
- Commits locales: solo cuando Roxana lo pida.

## Regla 6: Ciberseguridad — vital y no negociable

Roxana no es experta en ciberseguridad. Consecuencias:

- **Toda advertencia de seguridad que la IA emita debe tratarse como VITAL**,
  con prioridad absoluta sobre cualquier tarea en curso.
- La seguridad del producto debe estar **bien estructurada end-to-end**:
  secretos fuera del repo y de las sesiones de IA, validación de entradas,
  dependencias auditadas, principio de mínimo privilegio, datos de usuario
  protegidos por diseño.
- El producto debe poder **pasar validaciones externas de brechas**
  (auditorías, pentesting) sin hallazgos críticos. Si una decisión de diseño
  crea riesgo de brecha, se documenta y se corrige antes de avanzar.
- Ante cualquier duda de seguridad, la respuesta por defecto es la opción más
  restrictiva. Se pregunta antes de relajar cualquier control.

## Regla 7: Presupuesto de IA — límite duro de 50 €

El saldo disponible en GPU Flow es de **50 €**. Es el presupuesto límite de IA
para toda la fase de desarrollo/piloto de MonoLite.

- **Nada por encima de L2/L3 batch se ejecuta sin estimar antes su coste.**
- Todo trabajo L3 (extracción de packs, OCR masivo) requiere: estimación de
  coste previa + aprobación de Roxana si supera **2 € por operación**.
- Registrar cada gasto relevante (OCR masivos, extracciones de packs) con su
  coste estimado y real en `Docs-Internal/gastos-ia.md`.
- El objetivo del presupuesto: llegar al **piloto completo con un estudio
  español gastando ≤ 20 €** (estimación vigente: pack Granada ~15-20 €).
- Si una operación puede hacerse en L0 (determinista) o con cacheo, es
  obligatorio hacerlo así; el gasto de IA solo se justifica donde hay valor
  acumulable (packs) o interacción (copiloto).
