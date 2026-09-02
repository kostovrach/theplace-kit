/**
 * Допустимые типы идентификации элементов спойлера.
 */
export type SpoilerValue = string | number;

/**
 * Props корневого компонента спойлера.
 */
export interface SpoilerRootProps {
    /**
     * HTML-тег корневого элемента компонента.
     *
     * @default 'div'
     */
    is?: keyof HTMLElementTagNameMap;

    /**
     * CSS-класс корневого элемента.
     */
    class?: string | Record<string, unknown> | string[];

    /**
     * Управляемые открытые элементы через `v-model`.
     */
    modelValue?: SpoilerValue[];

    /**
     * Начальные открытые элементы в неуправляемом режиме.
     */
    defaultValue?: SpoilerValue[];

    /**
     * Возможность одновременного открытия нескольких элементов.
     *
     * @default false
     */
    multiple?: boolean;

    /**
     * Возможность закрытия всех элементов.
     *
     * Актуально только при отключенном режиме `multiple`.
     *
     * @default true
     */
    collapsible?: boolean;

    /**
     * Состояние отключения всего компонента.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Автоматическая анимация переключения элементов.
     *
     * @default true
     */
    animated?: boolean;
}

/**
 * События корневого компонента спойлера.
 */
export interface SpoilerRootEmits {
    /**
     * Изменение значения открытых элементов.
     */
    'update:modelValue': [value: SpoilerValue[]];

    /**
     * Изменение состояния открытых элементов.
     */
    change: [value: SpoilerValue[]];
}

/**
 * Props элементов спойлера.
 */
export interface SpoilerItemProps {
    /**
     * HTML-тег корневого элемента компонента.
     *
     * @default 'div'
     */
    is?: keyof HTMLElementTagNameMap;

    /**
     * CSS-класс элемента.
     */
    class?: string | Record<string, unknown> | string[];

    /**
     * Уникальное идентификатор элемента.
     */
    value: SpoilerValue;

    /**
     * Состояние отключения конкретного элемента.
     *
     * @default false
     */
    disabled?: boolean;
}

/**
 * Контекст корневого компонента спойлера.
 *
 * Используется для передачи состояния и методов от корневого компонента
 * дочерним элементам без использования явных пропсов.
 */
export interface SpoilerContext {
    /**
     * Текущий список открытых элементов.
     */
    openValues: Ref<SpoilerValue[]>;

    /**
     * Флаг возможности одновременного открытия нескольких элементов.
     */
    multiple: ComputedRef<boolean>;

    /**
     * Флаг возможности закрытия всех элементов.
     */
    collapsible: ComputedRef<boolean>;

    /**
     * Флаг отключения всего компонента.
     */
    disabled: ComputedRef<boolean>;

    /**
     * Флаг использования нативной анимации переключения элементов.
     */
    animated: ComputedRef<boolean>;

    /**
     * Переключение состояния элемента.
     *
     * @param value - Значение идентификатора переключаемого элемента.
     */
    toggle: (value: SpoilerValue) => void;

    /**
     * Проверка открытого состояния элемента.
     *
     * @param value - Значение идентификатора элемента.
     * @returns `true`, если элемент открыт.
     */
    isOpen: (value: SpoilerValue) => boolean;

    /**
     * Проверка состояния отключения элемента.
     *
     * Учитывается состояние отключения всего компонента и конкретного элемента.
     *
     * @param value - Значение идентификатора элемента.
     * @returns `true`, если элемент отключен.
     */
    isItemDisabled: (value: SpoilerValue) => boolean;

    /**
     * Получение идентификаторов триггера и содержимого элемента.
     *
     * @param value - Значение идентификатора элемента.
     * @returns Идентификаторы связанных элементов триггера и содержимого.
     */
    getItemIds: (value: SpoilerValue) => { triggerId: string; contentId: string };

    /**
     * Регистрация идентификаторов триггера и содержимого элемента.
     *
     * @param value - Значение идентификатора элемента.
     * @param triggerId - Идентификатор элемента-триггера.
     * @param contentId - Идентификатор элемента с содержимым.
     */
    registerItemIds: (value: SpoilerValue, triggerId: string, contentId: string) => void;
}

/**
 * Ключ контекста корневого компонента спойлера.
 */
export const SpoilerContextKey: InjectionKey<SpoilerContext> = Symbol('SpoilerContext');

/**
 * Контекст отдельного элемента спойлера.
 *
 * Содержит состояние и методы, необходимые компонентам элемента
 * и его дочерним компонентам.
 */
export interface SpoilerItemContext {
    /**
     * Значение идентификатора элемента.
     */
    value: SpoilerValue;

    /**
     * Реактивный флаг открытого состояния элемента.
     */
    isOpen: ComputedRef<boolean>;

    /**
     * Реактивный флаг отключенного состояния элемента.
     */
    isDisabled: ComputedRef<boolean>;

    /**
     * Идентификатор элемента-триггера.
     */
    triggerId: string;

    /**
     * Идентификатор элемента с содержимым.
     */
    contentId: string;

    /**
     * Переключение состояния элемента.
     */
    toggle: () => void;
}

/**
 * Ключ контекста отдельного элемента спойлера.
 */
export const SpoilerItemContextKey: InjectionKey<SpoilerItemContext> = Symbol('SpoilerItemContext');
