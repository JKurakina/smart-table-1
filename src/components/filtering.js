export function initFiltering(elements, indexes) {
    // Заполняем выпадающий список продавцов
    Object.keys(indexes).forEach((elementName) => {
        elements[elementName].append(
            ...Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            })
        );
    });

    return (data, state, action) => {
        // Обработка кнопки "Сбросить" (крестик в поле)
        if (action && action.name === 'clear') {
            const field = action.dataset.field; // получаем 'date', 'customer' или 'seller'
            const input = action.parentElement.querySelector(`[name="${field}"]`);
            if (input) input.value = '';
            
            // Очищаем состояние
            if (state[field]) state[field] = '';
            if (state[`searchBy${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
                state[`searchBy${field.charAt(0).toUpperCase() + field.slice(1)}`] = '';
            }
        }

        // Фильтрация данных
        return data.filter(row => {
            // 1. Фильтр по дате
            if (state.searchByDate && !row.date.includes(state.searchByDate)) return false;
            
            // 2. Фильтр по покупателю
            if (state.searchByCustomer && !row.customer.includes(state.searchByCustomer)) return false;
            
            // 3. Фильтр по продавцу
            if (state.searchBySeller && row.seller !== state.searchBySeller) return false;
            
            // 4. Фильтр по сумме (от)
            if (state.totalFrom && row.total < parseInt(state.totalFrom)) return false;
            
            // 5. Фильтр по сумме (до)
            if (state.totalTo && row.total > parseInt(state.totalTo)) return false;

            return true;
        });
    }
}