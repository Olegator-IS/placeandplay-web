class EventFilters {
    constructor() {
        this.filters = {
            placeId: localStorage.getItem('orgId'),
            dateFrom: '',
            dateTo: '',
            statuses: [],
            eventType: '',
            priceMin: '',
            priceMax: '',
            availableSpots: '',
            search: '',
            page: 0,
            size: 5,
            sort: 'date_time,desc'
        };

        this.init();
    }

    init() {
        // Создаем HTML для фильтров
        this.createFilterUI();
        // Инициализируем обработчики событий
        this.initEventListeners();
        // Применяем сохраненные фильтры если есть
        this.loadSavedFilters();
        this.filters.placeId = localStorage.getItem('orgId');

    }

    createFilterUI() {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filters-container';
        filterContainer.innerHTML = `
            <div class="filters-panel">
                <div class="filters-header">
                    <h3>Фильтры</h3>
                    <button class="toggle-filters-btn" onclick="eventFilters.toggleFilters()">
                        <span class="filter-icon">🔍</span>
                    </button>
                </div>
                <div class="filters-body" id="filtersBody">
                    <div class="filters-grid">
                        <div class="filter-group">
                            <label>Поиск</label>
                            <div class="search-input-wrapper">
                                <input type="text" 
                                       id="searchFilter" 
                                       placeholder="Поиск по названию или описанию"
                                       class="search-input">
                                <span class="search-icon">🔍</span>
                            </div>
                        </div>
                        
                        <div class="filter-group">
                            <label>Период</label>
                            <div class="date-range-inputs">
                                <input type="date" id="dateFromFilter" class="date-input">
                                <span class="date-separator">-</span>
                                <input type="date" id="dateToFilter" class="date-input">
                            </div>
                        </div>

                        <div class="filter-group">
                            <label>Статус</label>
                            <select id="statusFilter" class="select-input">
                                <option value="">Все статусы</option>
                                <option value="OPEN">Открытые</option>
                                <option value="COMPLETED">Завершённые</option>
                                <option value="CANCELLED">Отменённые</option>
                                <option value="EXPIRED">Истёкшие</option>
                            </select>
                        </div>

                        <div class="filter-group">
                            <label>Тип события</label>
                            <select id="eventTypeFilter" class="select-input">
                                <option value="">Все типы</option>
                                <option value="TENNIS">Теннис</option>
                                <option value="FOOTBALL">Футбол</option>
                                <option value="BASKETBALL">Баскетбол</option>
                                <option value="VOLLEYBALL">Волейбол</option>
                            </select>
                        </div>

                        <div class="filter-group">
                            <label>Цена (сум)</label>
                            <div class="price-range-inputs">
                                <input type="number" 
                                       id="priceMinFilter" 
                                       placeholder="От"
                                       class="price-input">
                                <span class="price-separator">-</span>
                                <input type="number" 
                                       id="priceMaxFilter" 
                                       placeholder="До"
                                       class="price-input">
                            </div>
                        </div>

                        <div class="filter-group">
                            <label>Свободных мест (минимум)</label>
                            <input type="number" 
                                   id="availableSpotsFilter" 
                                   min="1" 
                                   placeholder="Мин. кол-во мест"
                                   class="number-input">
                        </div>
                    </div>

                    <div class="active-filters" id="activeFilters"></div>
                    
                    <div class="filters-actions">
                        <button class="reset-filters-btn" onclick="eventFilters.resetFilters()">
                            Сбросить
                        </button>
                        <button class="apply-filters-btn" onclick="eventFilters.applyFilters()">
                            Применить
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Добавляем стили
        this.addStyles();

        // Вставляем фильтры в DOM
        const eventsSection = document.getElementById('eventsSection');
        const eventsList = document.getElementById('eventsList');
        eventsSection.insertBefore(filterContainer, eventsList);
    }

    addStyles() {
        const styles = `
            .filters-container {
                margin-bottom: 20px;
            }

            .filters-panel {
                background: white;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                overflow: hidden;
            }

            .filters-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background: #f8f9fa;
                border-bottom: 1px solid #dee2e6;
            }

            .filters-header h3 {
                margin: 0;
                color: #495057;
                font-size: 1.1em;
            }

            .toggle-filters-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 5px;
                color: #6c757d;
                transition: color 0.2s;
            }

            .toggle-filters-btn:hover {
                color: #495057;
            }

            .filters-body {
                padding: 20px;
            }

            .filters-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
            }

            .filter-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .filter-group label {
                color: #495057;
                font-weight: 500;
                font-size: 0.9em;
            }

            .search-input-wrapper {
                position: relative;
            }

            .search-input {
                width: 100%;
                padding: 8px 35px 8px 12px;
                border: 1px solid #dee2e6;
                border-radius: 6px;
                font-size: 0.9em;
            }

            .search-icon {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                color: #adb5bd;
            }

            .date-range-inputs,
            .price-range-inputs {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .date-input,
            .price-input,
            .select-input,
            .number-input {
                padding: 8px 12px;
                border: 1px solid #dee2e6;
                border-radius: 6px;
                font-size: 0.9em;
                width: 100%;
            }

            .date-separator,
            .price-separator {
                color: #adb5bd;
            }

            .active-filters {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 15px;
                min-height: 30px;
            }

            .filter-tag {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                padding: 4px 10px;
                background: #e9ecef;
                border-radius: 15px;
                font-size: 0.85em;
                color: #495057;
            }

            .filter-tag button {
                border: none;
                background: none;
                color: #dc3545;
                cursor: pointer;
                padding: 0 3px;
                font-size: 1.1em;
                line-height: 1;
            }

            .filter-tag button:hover {
                color: #c82333;
            }

            .filters-actions {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                padding-top: 15px;
                border-top: 1px solid #dee2e6;
            }

            .reset-filters-btn,
            .apply-filters-btn {
                padding: 8px 16px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                transition: background-color 0.2s;
            }

            .reset-filters-btn {
                background: #e9ecef;
                color: #495057;
            }

            .reset-filters-btn:hover {
                background: #dee2e6;
            }

            .apply-filters-btn {
                background: #28a745;
                color: white;
            }

            .apply-filters-btn:hover {
                background: #218838;
            }

            @media (max-width: 768px) {
                .filters-grid {
                    grid-template-columns: 1fr;
                }

                .date-range-inputs,
                .price-range-inputs {
                    flex-direction: column;
                }

                .date-separator,
                .price-separator {
                    display: none;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    initEventListeners() {
        // Поиск
        const searchInput = document.getElementById('searchFilter');
        searchInput.addEventListener('input', debounce((e) => {
            this.filters.search = e.target.value;
            this.updateActiveFilters();
        }, 500));

        // Даты
        const dateFromInput = document.getElementById('dateFromFilter');
        const dateToInput = document.getElementById('dateToFilter');
        dateFromInput.addEventListener('change', (e) => {
            this.filters.dateFrom = e.target.value;
            this.updateActiveFilters();
        });
        dateToInput.addEventListener('change', (e) => {
            this.filters.dateTo = e.target.value;
            this.updateActiveFilters();
        });

        // Статус
        const statusSelect = document.getElementById('statusFilter');
        statusSelect.addEventListener('change', (e) => {
            this.filters.statuses = [e.target.value];
            this.updateActiveFilters();
        });

        // Тип события
        const eventTypeSelect = document.getElementById('eventTypeFilter');
        eventTypeSelect.addEventListener('change', (e) => {
            this.filters.eventType = e.target.value;
            this.updateActiveFilters();
        });

        // Цена
        const priceMinInput = document.getElementById('priceMinFilter');
        const priceMaxInput = document.getElementById('priceMaxFilter');
        priceMinInput.addEventListener('input', debounce((e) => {
            this.filters.priceMin = e.target.value;
            this.updateActiveFilters();
        }, 500));
        priceMaxInput.addEventListener('input', debounce((e) => {
            this.filters.priceMax = e.target.value;
            this.updateActiveFilters();
        }, 500));

        // Свободные места
        const availableSpotsInput = document.getElementById('availableSpotsFilter');
        availableSpotsInput.addEventListener('input', debounce((e) => {
            this.filters.availableSpots = e.target.value;
            this.updateActiveFilters();
        }, 500));
    }

    updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('activeFilters');
        let activeFiltersHtml = '';

        if (this.filters.search) {
            activeFiltersHtml += this.createFilterTag('Поиск', this.filters.search, 'search');
        }
        if (this.filters.dateFrom || this.filters.dateTo) {
            const dateRange = `${this.filters.dateFrom || 'начала'} - ${this.filters.dateTo || 'конца'}`;
            activeFiltersHtml += this.createFilterTag('Период', dateRange, 'date');
        }
        if (this.filters.statuses.length > 0) {
            activeFiltersHtml += this.createFilterTag('Статус', this.getStatusText(this.filters.statuses[0]), 'status');
        }
        if (this.filters.eventType) {
            activeFiltersHtml += this.createFilterTag('Тип', this.filters.eventType, 'eventType');
        }
        if (this.filters.priceMin || this.filters.priceMax) {
            const priceRange = `${this.filters.priceMin || '0'} - ${this.filters.priceMax || '∞'} сум`;
            activeFiltersHtml += this.createFilterTag('Цена', priceRange, 'price');
        }
        if (this.filters.availableSpots) {
            activeFiltersHtml += this.createFilterTag('Мест от', this.filters.availableSpots, 'availableSpots');
        }

        activeFiltersContainer.innerHTML = activeFiltersHtml;
    }

    createFilterTag(label, value, filterKey) {
        return `
            <div class="filter-tag">
                ${label}: ${value}
                <button onclick="eventFilters.removeFilter('${filterKey}')">&times;</button>
            </div>
        `;
    }

    removeFilter(filterKey) {
        if (filterKey === 'date') {
            this.filters.dateFrom = '';
            this.filters.dateTo = '';
            document.getElementById('dateFromFilter').value = '';
            document.getElementById('dateToFilter').value = '';
        } else if (filterKey === 'price') {
            this.filters.priceMin = '';
            this.filters.priceMax = '';
            document.getElementById('priceMinFilter').value = '';
            document.getElementById('priceMaxFilter').value = '';
        } else {
            this.filters[filterKey] = '';
            document.getElementById(filterKey + 'Filter').value = '';
        }
        this.updateActiveFilters();
        this.applyFilters();
    }

    resetFilters() {
        this.filters = {
            placeId: localStorage.getItem('orgId'),
            dateFrom: '',
            dateTo: '',
            statuses: [],
            eventType: '',
            priceMin: '',
            priceMax: '',
            availableSpots: '',
            search: '',
            page: 0,
            size: 5,
            sort: 'date_time,desc'
        };

        // Сбрасываем значения в форме
        document.querySelectorAll('.filters-panel input, .filters-panel select').forEach(input => {
            input.value = '';
        });

        this.updateActiveFilters();
        this.applyFilters();
        this.saveFilters();
    }

    applyFilters() {
        this.filters.page = 0; // Сбрасываем страницу при применении фильтров
        this.saveFilters();
        loadEvents(0); // Вызываем глобальную функцию загрузки событий
    }

    getStatusText(status) {
        const statuses = {
            'OPEN': 'Открытые',
            'COMPLETED': 'Завершить',
            'CANCELLED': 'Отменённые',
            'EXPIRED': 'Истёкшие',
            
        };
        return statuses[status] || status;
    }

    toggleFilters() {
        const filtersBody = document.getElementById('filtersBody');
        filtersBody.style.display = filtersBody.style.display === 'none' ? 'block' : 'none';
    }

    saveFilters() {
        localStorage.setItem('eventFilters', JSON.stringify(this.filters));
    }

    loadSavedFilters() {
        const savedFilters = localStorage.getItem('eventFilters');
        if (savedFilters) {
            this.filters = { ...this.filters, ...JSON.parse(savedFilters) };
            
            // Восстанавливаем значения в форме
            if (this.filters.search) document.getElementById('searchFilter').value = this.filters.search;
            if (this.filters.dateFrom) document.getElementById('dateFromFilter').value = this.filters.dateFrom;
            if (this.filters.dateTo) document.getElementById('dateToFilter').value = this.filters.dateTo;
            if (this.filters.statuses.length > 0) document.getElementById('statusFilter').value = this.filters.statuses[0];
            if (this.filters.eventType) document.getElementById('eventTypeFilter').value = this.filters.eventType;
            if (this.filters.priceMin) document.getElementById('priceMinFilter').value = this.filters.priceMin;
            if (this.filters.priceMax) document.getElementById('priceMaxFilter').value = this.filters.priceMax;
            if (this.filters.availableSpots) document.getElementById('availableSpotsFilter').value = this.filters.availableSpots;

            this.updateActiveFilters();
        }
    }

    setStatuses(statuses) {
        this.filters.statuses = Array.isArray(statuses) ? statuses : [statuses];
        this.saveFilters();
    }

    toggleStatus(status) {
        const index = this.filters.statuses.indexOf(status);
        if (index === -1) {
            this.filters.statuses.push(status);
        } else {
            this.filters.statuses.splice(index, 1);
        }
        this.saveFilters();
    }

    setSort(field, direction) {
        this.filters.sort = `${field},${direction.toLowerCase()}`;
        this.saveFilters();
    }
}

// Функция для дебаунсинга
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Создаем глобальный экземпляр фильтров
let eventFilters; 