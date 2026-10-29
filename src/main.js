import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
import {initPagination} from "./components/pagination.js";
import {initSorting} from "./components/sorting.js";
import {initFiltering} from "./components/filtering.js";
import {initSearching} from "./components/searching.js"; // Убедись, что файл называется searching.js (или поменяй на search.js)

// Исходные данные
const {data, ...indexes} = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));

    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);

        return {
        ...state,
        searchByDate: state.date,
        searchByCustomer: state.customer,
        searchBySeller: state.seller,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка состояния таблицы
 */
function render(action) {
    let state = collectState();
    let result = [...data];

    // Порядок важен: Поиск -> Фильтрация -> Сортировка -> Пагинация
    result = applySearching(result, state, action);
    result = applyFiltering(result, state, action);
    result = applySorting(result, state, action);
    result = applyPagination(result, state, action);

    sampleTable.render(result);
}

// 1. Создаём таблицу ПЕРВОЙ
const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

// 2. Инициализация модулей (ОБЯЗАТЕЛЬНО ДО ВЫЗОВА render())
const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const applyFiltering = initFiltering(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers
});

// Вот она, наша переменная. Теперь она создана ДО вызова render()
const applySearching = initSearching('search');

// 3. Монтируем и запускаем
const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();