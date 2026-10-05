document.addEventListener('DOMContentLoaded', () => {
    // --- State & Data ---
    let history = JSON.parse(localStorage.getItem('calcHistory')) || [];
    let favorites = JSON.parse(localStorage.getItem('calcFavorites')) || [];
    let recent = JSON.parse(localStorage.getItem('calcRecent')) || [];
    
    const calculators = [
        { id: 'basic', name: 'Basic Calculator', category: 'Math', icon: '🧮' },
        { id: 'scientific', name: 'Scientific Calculator', category: 'Math', icon: '🔬' },
        { id: 'age', name: 'Age Calculator', category: 'Health', icon: '🎂' },
        { id: 'bmi', name: 'BMI Calculator', category: 'Health', icon: '⚖️' },
        { id: 'emi', name: 'EMI / Loan Calculator', category: 'Finance', icon: '🏦' },
        { id: 'simple-interest', name: 'Simple Interest', category: 'Finance', icon: '📈' },
        { id: 'compound-interest', name: 'Compound Interest', category: 'Finance', icon: '📊' },
        { id: 'percentage', name: 'Percentage Calculator', category: 'Math', icon: '％' },
        { id: 'discount', name: 'Discount Calculator', category: 'Finance', icon: '🏷️' },
        { id: 'gst', name: 'GST / Tax Calculator', category: 'Finance', icon: '🧾' },
        { id: 'currency', name: 'Currency Converter', category: 'Finance', icon: '💱' },
        { id: 'unit', name: 'Unit Converter', category: 'Conversion', icon: '📏' },
        { id: 'time', name: 'Time Calculator', category: 'Time', icon: '⏱️' },
        { id: 'date', name: 'Date Calculator', category: 'Time', icon: '📅' },
        { id: 'gpa', name: 'GPA / CGPA Calculator', category: 'Education', icon: '🎓' },
        { id: 'fraction', name: 'Fraction Calculator', category: 'Math', icon: '➗' },
        { id: 'ratio', name: 'Ratio Calculator', category: 'Math', icon: '⚖️' },
        { id: 'profit-loss', name: 'Profit & Loss Calculator', category: 'Finance', icon: '💹' },
        { id: 'marks', name: 'Marks / Percentage', category: 'Education', icon: '📝' },
        { id: 'tip', name: 'Tip Calculator', category: 'Finance', icon: '💵' },
        { id: 'fuel', name: 'Fuel Cost Calculator', category: 'Auto', icon: '⛽' },
        { id: 'data', name: 'Data Storage', category: 'Conversion', icon: '💾' },
        { id: 'countdown', name: 'Countdown', category: 'Time', icon: '⏳' }
    ];

    // --- DOM Elements ---
    const calcList = document.getElementById('calcList');
    const calcSearch = document.getElementById('calcSearch');
    const calculatorContainer = document.getElementById('calculatorContainer');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const historyList = document.getElementById('historyList');
    const favoritesList = document.getElementById('favoritesList');
    const recentList = document.getElementById('recentList');
    const themeToggle = document.getElementById('themeToggle');
    
    // --- Initialization ---
    initTheme();
    renderSidebarList(calculators);
    renderDashboardLists();
    renderHistory();
    setupCalculatorsUI();

    // --- Sidebar & Search ---
    calcSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = calculators.filter(c => 
            c.name.toLowerCase().includes(query) || c.category.toLowerCase().includes(query)
        );
        renderSidebarList(filtered);
    });

    document.getElementById('openSidebar').addEventListener('click', () => {
        document.getElementById('sidebar').classList.add('open');
    });
    
    document.getElementById('closeSidebar').addEventListener('click', () => {
        document.getElementById('sidebar').classList.remove('open');
    });

    // --- Theme ---
    function initTheme() {
        const isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) {
            document.body.classList.replace('light-mode', 'dark-mode');
            themeToggle.innerText = '☀️ Light Mode';
        }
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-mode');
        if (isDark) {
            document.body.classList.replace('dark-mode', 'light-mode');
            themeToggle.innerText = '🌙 Dark Mode';
            localStorage.setItem('darkMode', 'false');
        } else {
            document.body.classList.replace('light-mode', 'dark-mode');
            themeToggle.innerText = '☀️ Light Mode';
            localStorage.setItem('darkMode', 'true');
        }
    });

    // --- Navigation ---
    function renderSidebarList(list) {
        calcList.innerHTML = '';
        list.forEach(calc => {
            const li = document.createElement('li');
            li.dataset.id = calc.id;
            
            const isFav = favorites.includes(calc.id);
            li.innerHTML = `
                <span>${calc.icon} ${calc.name}</span>
                <span class="fav-icon ${isFav ? 'active' : ''}" data-id="${calc.id}">★</span>
            `;
            
            li.addEventListener('click', (e) => {
                if(e.target.classList.contains('fav-icon')) {
                    toggleFavorite(calc.id, e.target);
                } else {
                    openCalculator(calc.id);
                    document.getElementById('sidebar').classList.remove('open');
                }
            });
            calcList.appendChild(li);
        });
    }

    function toggleFavorite(id, iconEl) {
        if (favorites.includes(id)) {
            favorites = favorites.filter(f => f !== id);
            iconEl.classList.remove('active');
        } else {
            favorites.push(id);
            iconEl.classList.add('active');
        }
        localStorage.setItem('calcFavorites', JSON.stringify(favorites));
        renderDashboardLists();
    }

    function addRecent(id) {
        recent = recent.filter(r => r !== id);
        recent.unshift(id);
        if (recent.length > 5) recent.pop();
        localStorage.setItem('calcRecent', JSON.stringify(recent));
        renderDashboardLists();
    }

    function renderDashboardLists() {
        favoritesList.innerHTML = '';
        favorites.forEach(id => {
            const calc = calculators.find(c => c.id === id);
            if (calc) {
                const li = document.createElement('li');
                li.innerHTML = `${calc.icon} ${calc.name}`;
                li.addEventListener('click', () => openCalculator(id));
                favoritesList.appendChild(li);
            }
        });

        recentList.innerHTML = '';
        recent.forEach(id => {
            const calc = calculators.find(c => c.id === id);
            if (calc) {
                const li = document.createElement('li');
                li.innerHTML = `${calc.icon} ${calc.name}`;
                li.addEventListener('click', () => openCalculator(id));
                recentList.appendChild(li);
            }
        });
    }

    function openCalculator(id) {
        welcomeScreen.classList.remove('active');
        document.querySelectorAll('.calc-view').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.sidebar-nav li').forEach(el => el.classList.remove('active'));
        
        const calcEl = document.getElementById(`view-${id}`);
        if (calcEl) calcEl.classList.add('active');
        
        const navEl = document.querySelector(`.sidebar-nav li[data-id="${id}"]`);
        if (navEl) navEl.classList.add('active');

        addRecent(id);
        
        // Setup specific handlers if needed on open
    }

    // --- History ---
    function addHistory(calcName, expression, result) {
        const item = {
            id: Date.now(),
            calcName,
            expression,
            result,
            date: new Date().toLocaleString()
        };
        history.unshift(item);
        if(history.length > 50) history.pop();
        localStorage.setItem('calcHistory', JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        historyList.innerHTML = '';
        history.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <div class="hist-meta">${item.date} • ${item.calcName}</div>
                    <div class="hist-expr">${item.expression}</div>
                    <div class="hist-res">${item.result}</div>
                </div>
                <button class="hist-del" data-id="${item.id}">&times;</button>
            `;
            historyList.appendChild(li);
        });

        document.querySelectorAll('.hist-del').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                history = history.filter(h => h.id !== id);
                localStorage.setItem('calcHistory', JSON.stringify(history));
                renderHistory();
            });
        });
    }

    document.getElementById('clearHistoryBtn').addEventListener('click', () => {
        history = [];
        localStorage.setItem('calcHistory', JSON.stringify([]));
        renderHistory();
    });

    // --- Calculator Generators & Logic ---
    
    function createGenericForm(id, name, inputs, resultLabel, buttonText = 'Calculate') {
        let html = `
            <div id="view-${id}" class="calc-view">
                <div class="calc-card">
                    <div class="calc-header">
                        <h2>${name}</h2>
                    </div>
                    <div class="calc-body">
        `;
        
        inputs.forEach(inp => {
            if (inp.type === 'select') {
                html += `
                    <div class="input-group">
                        <label>${inp.label}</label>
                        <select id="${id}-${inp.id}">
                            ${inp.options.map(opt => `<option value="${opt.value}">${opt.text}</option>`).join('')}
                        </select>
                    </div>
                `;
            } else {
                html += `
                    <div class="input-group">
                        <label>${inp.label}</label>
                        <input type="${inp.type || 'number'}" id="${id}-${inp.id}" placeholder="${inp.placeholder || ''}" ${inp.attr || ''}>
                    </div>
                `;
            }
        });

        html += `
                        <button class="calc-btn" id="btn-${id}">${buttonText}</button>
                        <div class="result-box">
                            <h3>${resultLabel}</h3>
                            <div class="result-value" id="res-${id}">-</div>
                            <div id="msg-${id}" class="msg"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return html;
    }

    function setupCalculatorsUI() {
        let html = '';

        // 1. Basic Calculator HTML
        html += `
            <div id="view-basic" class="calc-view">
                <div class="calc-card standard-calc">
                    <div class="calc-header"><h2>Basic Calculator</h2></div>
                    <div class="calc-display-area">
                        <div class="calc-expr" id="basic-expr"></div>
                        <div class="calc-val" id="basic-val">0</div>
                    </div>
                    <div class="keypad">
                        <button class="key danger" onclick="basicCalc.ac()">AC</button>
                        <button class="key danger" onclick="basicCalc.del()">DEL</button>
                        <button class="key sp" onclick="basicCalc.toggleSign()">+/-</button>
                        <button class="key op" onclick="basicCalc.op('/')">÷</button>
                        
                        <button class="key" onclick="basicCalc.num('7')">7</button>
                        <button class="key" onclick="basicCalc.num('8')">8</button>
                        <button class="key" onclick="basicCalc.num('9')">9</button>
                        <button class="key op" onclick="basicCalc.op('*')">×</button>
                        
                        <button class="key" onclick="basicCalc.num('4')">4</button>
                        <button class="key" onclick="basicCalc.num('5')">5</button>
                        <button class="key" onclick="basicCalc.num('6')">6</button>
                        <button class="key op" onclick="basicCalc.op('-')">-</button>
                        
                        <button class="key" onclick="basicCalc.num('1')">1</button>
                        <button class="key" onclick="basicCalc.num('2')">2</button>
                        <button class="key" onclick="basicCalc.num('3')">3</button>
                        <button class="key op" onclick="basicCalc.op('+')">+</button>
                        
                        <button class="key" onclick="basicCalc.num('00')">00</button>
                        <button class="key" onclick="basicCalc.num('0')">0</button>
                        <button class="key" onclick="basicCalc.num('.')">.</button>
                        <button class="key eq" onclick="basicCalc.eq()">=</button>
                    </div>
                </div>
            </div>
        `;

        // 2. Scientific Calculator HTML
        html += `
            <div id="view-scientific" class="calc-view">
                <div class="calc-card sci-calc">
                    <div class="calc-header">
                        <h2>Scientific Calculator</h2>
                        <button class="action-btn" id="sci-mode-btn" onclick="sciCalc.toggleMode()">DEG</button>
                    </div>
                    <div class="calc-display-area">
                        <div class="calc-expr" id="sci-expr"></div>
                        <div class="calc-val" id="sci-val">0</div>
                    </div>
                    <div class="keypad sci-keypad">
                        <button class="key sp" onclick="sciCalc.func('sin')">sin</button>
                        <button class="key sp" onclick="sciCalc.func('cos')">cos</button>
                        <button class="key sp" onclick="sciCalc.func('tan')">tan</button>
                        <button class="key sp" onclick="sciCalc.func('log')">log</button>
                        <button class="key sp" onclick="sciCalc.func('ln')">ln</button>
                        
                        <button class="key sp" onclick="sciCalc.func('asin')">sin⁻¹</button>
                        <button class="key sp" onclick="sciCalc.func('acos')">cos⁻¹</button>
                        <button class="key sp" onclick="sciCalc.func('atan')">tan⁻¹</button>
                        <button class="key sp" onclick="sciCalc.func('sqrt')">√</button>
                        <button class="key sp" onclick="sciCalc.func('cbrt')">∛</button>

                        <button class="key sp" onclick="sciCalc.func('sqr')">x²</button>
                        <button class="key sp" onclick="sciCalc.func('cube')">x³</button>
                        <button class="key sp" onclick="sciCalc.op('^')">xʸ</button>
                        <button class="key sp" onclick="sciCalc.func('inv')">1/x</button>
                        <button class="key sp" onclick="sciCalc.func('fact')">n!</button>
                        
                        <button class="key" onclick="sciCalc.num('(')">(</button>
                        <button class="key" onclick="sciCalc.num(')')">)</button>
                        <button class="key sp" onclick="sciCalc.const('PI')">π</button>
                        <button class="key sp" onclick="sciCalc.const('E')">e</button>
                        <button class="key danger" onclick="sciCalc.del()">DEL</button>

                        <button class="key" onclick="sciCalc.num('7')">7</button>
                        <button class="key" onclick="sciCalc.num('8')">8</button>
                        <button class="key" onclick="sciCalc.num('9')">9</button>
                        <button class="key danger" onclick="sciCalc.ac()">AC</button>
                        <button class="key op" onclick="sciCalc.op('/')">÷</button>
                        
                        <button class="key" onclick="sciCalc.num('4')">4</button>
                        <button class="key" onclick="sciCalc.num('5')">5</button>
                        <button class="key" onclick="sciCalc.num('6')">6</button>
                        <button class="key op" onclick="sciCalc.op('*')">×</button>
                        <button class="key op" onclick="sciCalc.op('-')">-</button>
                        
                        <button class="key" onclick="sciCalc.num('1')">1</button>
                        <button class="key" onclick="sciCalc.num('2')">2</button>
                        <button class="key" onclick="sciCalc.num('3')">3</button>
                        <button class="key op" onclick="sciCalc.op('+')">+</button>
                        <button class="key eq" style="grid-row: span 2;" onclick="sciCalc.eq()">=</button>
                        
                        <button class="key" onclick="sciCalc.num('0')">0</button>
                        <button class="key" onclick="sciCalc.num('.')">.</button>
                        <button class="key sp" onclick="sciCalc.num('E')">EXP</button>
                        <button class="key sp" onclick="sciCalc.op('%')">%</button>
                    </div>
                </div>
            </div>
        `;

        // 3. Age
        html += createGenericForm('age', 'Age Calculator', [
            { id: 'dob', label: 'Date of Birth', type: 'date' },
            { id: 'target', label: 'Target Date (Default is Today)', type: 'date' }
        ], 'Result');

        // 4. BMI
        html += createGenericForm('bmi', 'BMI Calculator', [
            { id: 'unit', label: 'Unit System', type: 'select', options: [{value:'metric', text:'Metric (kg, cm)'}, {value:'imperial', text:'Imperial (lb, ft)'}] },
            { id: 'weight', label: 'Weight', placeholder: 'Enter weight' },
            { id: 'height', label: 'Height', placeholder: 'Enter height' }
        ], 'BMI');

        // 5. EMI
        html += createGenericForm('emi', 'EMI Calculator', [
            { id: 'amount', label: 'Loan Amount', placeholder: 'e.g. 500000' },
            { id: 'rate', label: 'Interest Rate (%)', placeholder: 'e.g. 8.5' },
            { id: 'tenure', label: 'Loan Tenure', placeholder: 'e.g. 5' },
            { id: 'tenureType', label: 'Tenure Type', type: 'select', options: [{value:'years', text:'Years'}, {value:'months', text:'Months'}] }
        ], 'Monthly EMI');

        // 8. Percentage
        html += createGenericForm('percentage', 'Percentage Calculator', [
            { id: 'mode', label: 'Mode', type: 'select', options: [
                {value:'a', text:'What is X% of Y?'},
                {value:'b', text:'X is what percentage of Y?'},
                {value:'c', text:'Percentage change from X to Y'}
            ]},
            { id: 'x', label: 'Value X', placeholder: 'Enter X' },
            { id: 'y', label: 'Value Y', placeholder: 'Enter Y' }
        ], 'Result');

        // 9. Discount
        html += createGenericForm('discount', 'Discount Calculator', [
            { id: 'price', label: 'Original Price', placeholder: '0' },
            { id: 'off', label: 'Discount (%)', placeholder: '0' },
            { id: 'tax', label: 'Tax (%) [Optional]', placeholder: '0' }
        ], 'Final Price');

        // 10. GST
        html += createGenericForm('gst', 'GST Calculator', [
            { id: 'mode', label: 'Mode', type: 'select', options: [{value:'add', text:'Add GST'}, {value:'remove', text:'Remove GST'}] },
            { id: 'amount', label: 'Amount', placeholder: '0' },
            { id: 'rate', label: 'GST Rate (%)', type: 'select', options: [{value:'5',text:'5%'}, {value:'12',text:'12%'}, {value:'18',text:'18%'}, {value:'28',text:'28%'}] }
        ], 'Result');

        // 12. Unit Converter
        html += createGenericForm('unit', 'Unit Converter', [
            { id: 'type', label: 'Category', type: 'select', options: [{value:'length', text:'Length'}, {value:'weight', text:'Weight'}, {value:'temp', text:'Temperature'}] },
            { id: 'val', label: 'Value to Convert', placeholder: '0' },
            { id: 'from', label: 'From Unit', type: 'select', options: [{value:'km', text:'Kilometers'}, {value:'m', text:'Meters'}, {value:'cm', text:'Centimeters'}, {value:'mm', text:'Millimeters'}] },
            { id: 'to', label: 'To Unit', type: 'select', options: [{value:'m', text:'Meters'}, {value:'km', text:'Kilometers'}, {value:'cm', text:'Centimeters'}, {value:'mm', text:'Millimeters'}] }
        ], 'Converted Value');

        // 16. Fraction
        html += createGenericForm('fraction', 'Fraction Calculator', [
            { id: 'n1', label: 'Numerator 1', placeholder: '1' },
            { id: 'd1', label: 'Denominator 1', placeholder: '2' },
            { id: 'op', label: 'Operation', type: 'select', options: [{value:'+',text:'+'},{value:'-',text:'-'},{value:'*',text:'×'},{value:'/',text:'÷'}] },
            { id: 'n2', label: 'Numerator 2', placeholder: '1' },
            { id: 'd2', label: 'Denominator 2', placeholder: '4' }
        ], 'Result');

        // 17. Ratio
        html += createGenericForm('ratio', 'Ratio Simplifier', [
            { id: 'a', label: 'Value A', placeholder: 'e.g. 20' },
            { id: 'b', label: 'Value B', placeholder: 'e.g. 30' }
        ], 'Simplified Ratio');

        // 18. Profit/Loss
        html += createGenericForm('profit-loss', 'Profit & Loss Calculator', [
            { id: 'cp', label: 'Cost Price', placeholder: '0' },
            { id: 'sp', label: 'Selling Price', placeholder: '0' }
        ], 'Result');

        // 20. Tip
        html += createGenericForm('tip', 'Tip Calculator', [
            { id: 'bill', label: 'Bill Amount', placeholder: '0' },
            { id: 'tipPercent', label: 'Tip Percentage (%)', placeholder: '15' },
            { id: 'people', label: 'Number of People', placeholder: '1' }
        ], 'Result');

        // 21. Fuel
        html += createGenericForm('fuel', 'Fuel Cost Calculator', [
            { id: 'dist', label: 'Distance', placeholder: '0' },
            { id: 'mil', label: 'Mileage (per unit of fuel)', placeholder: '0' },
            { id: 'price', label: 'Fuel Price (per unit)', placeholder: '0' }
        ], 'Total Cost');


        // 6. Simple Interest
        html += createGenericForm('simple-interest', 'Simple Interest', [
            { id: 'p', label: 'Principal Amount', placeholder: '0' },
            { id: 'r', label: 'Rate of Interest (%)', placeholder: '0' },
            { id: 't', label: 'Time (Years)', placeholder: '0' }
        ], 'Total Amount');

        // 7. Compound Interest
        html += createGenericForm('compound-interest', 'Compound Interest', [
            { id: 'p', label: 'Principal Amount', placeholder: '0' },
            { id: 'r', label: 'Rate of Interest (%)', placeholder: '0' },
            { id: 't', label: 'Time (Years)', placeholder: '0' },
            { id: 'n', label: 'Compounding Frequency (Per Year)', placeholder: 'e.g. 1 (Annually), 12 (Monthly)' }
        ], 'Total Amount');

        // 11. Currency Converter
        html += createGenericForm('currency', 'Currency Converter', [
            { id: 'amount', label: 'Amount', placeholder: '0' },
            { id: 'from', label: 'From Currency', type: 'select', options: [{value:'USD', text:'USD - US Dollar'}, {value:'EUR', text:'EUR - Euro'}, {value:'GBP', text:'GBP - British Pound'}, {value:'INR', text:'INR - Indian Rupee'}, {value:'JPY', text:'JPY - Japanese Yen'}, {value:'AUD', text:'AUD - Australian Dollar'}, {value:'CAD', text:'CAD - Canadian Dollar'}, {value:'AED', text:'AED - UAE Dirham'}, {value:'SGD', text:'SGD - Singapore Dollar'}] },
            { id: 'to', label: 'To Currency', type: 'select', options: [{value:'INR', text:'INR - Indian Rupee'}, {value:'USD', text:'USD - US Dollar'}, {value:'EUR', text:'EUR - Euro'}, {value:'GBP', text:'GBP - British Pound'}, {value:'JPY', text:'JPY - Japanese Yen'}, {value:'AUD', text:'AUD - Australian Dollar'}, {value:'CAD', text:'CAD - Canadian Dollar'}, {value:'AED', text:'AED - UAE Dirham'}, {value:'SGD', text:'SGD - Singapore Dollar'}] }
        ], 'Converted Amount');

        // 15. GPA/CGPA
        html += createGenericForm('gpa', 'GPA / CGPA Calculator', [
            { id: 's1', label: 'Subject 1 (Grade: A+, A, B+, B, C, D, F)', placeholder: 'A' },
            { id: 'c1', label: 'Credits 1', placeholder: '3' },
            { id: 's2', label: 'Subject 2 (Grade: A+, A, B+, B, C, D, F)', placeholder: 'B' },
            { id: 'c2', label: 'Credits 2', placeholder: '3' },
            { id: 's3', label: 'Subject 3 (Grade: A+, A, B+, B, C, D, F)', placeholder: 'A' },
            { id: 'c3', label: 'Credits 3', placeholder: '4' }
        ], 'GPA');

        // 19. Marks / Percentage
        html += createGenericForm('marks', 'Marks / Percentage', [
            { id: 'obtained', label: 'Marks Obtained', placeholder: '0' },
            { id: 'total', label: 'Total Marks', placeholder: '0' }
        ], 'Percentage');

        // 22. Data Storage
        html += createGenericForm('data', 'Data Storage Converter', [
            { id: 'val', label: 'Value to Convert', placeholder: '0' },
            { id: 'from', label: 'From Unit', type: 'select', options: [{value:'bit', text:'Bit'}, {value:'B', text:'Bytes'}, {value:'KB', text:'Kilobytes'}, {value:'MB', text:'Megabytes'}, {value:'GB', text:'Gigabytes'}, {value:'TB', text:'Terabytes'}, {value:'PB', text:'Petabytes'}] },
            { id: 'to', label: 'To Unit', type: 'select', options: [{value:'MB', text:'Megabytes'}, {value:'bit', text:'Bit'}, {value:'B', text:'Bytes'}, {value:'KB', text:'Kilobytes'}, {value:'GB', text:'Gigabytes'}, {value:'TB', text:'Terabytes'}, {value:'PB', text:'Petabytes'}] }
        ], 'Converted Value');

        // 13. Time Calculator
        html += createGenericForm('time', 'Time Calculator', [
            { id: 't1', label: 'Start Time', type: 'time' },
            { id: 'op', label: 'Operation', type: 'select', options: [{value:'diff', text:'Difference between times'}, {value:'add', text:'Add hours/minutes'}, {value:'sub', text:'Subtract hours/minutes'}] },
            { id: 't2', label: 'End Time (or time to add/sub)', type: 'time' }
        ], 'Result');

        // 14. Date Calculator
        html += createGenericForm('date', 'Date Calculator', [
            { id: 'd1', label: 'Start Date', type: 'date' },
            { id: 'op', label: 'Operation', type: 'select', options: [{value:'diff', text:'Difference between dates'}, {value:'add', text:'Add days'}, {value:'sub', text:'Subtract days'}] },
            { id: 'val', label: 'End Date / Days', type: 'text', placeholder: 'Enter end date (YYYY-MM-DD) or number of days' }
        ], 'Result');

        // 23. Countdown
        html += createGenericForm('countdown', 'Age / Date Countdown', [
            { id: 'target', label: 'Target Date', type: 'date' }
        ], 'Time Remaining');

        calculatorContainer.innerHTML = html;
        bindLogic();
    }

    // ==========================================
    // LOGIC BINDING
    // ==========================================
    
    function bindLogic() {
        // Age
        document.getElementById('btn-age').addEventListener('click', () => {
            const dob = document.getElementById('age-dob').value;
            const target = document.getElementById('age-target').value || new Date().toISOString().split('T')[0];
            const msg = document.getElementById('msg-age');
            const res = document.getElementById('res-age');
            
            if(!dob) { msg.className = 'msg error'; msg.innerText = 'Enter Date of Birth'; return; }
            msg.innerText = '';
            
            const d1 = new Date(dob);
            const d2 = new Date(target);
            if(d1 > d2) { msg.className = 'msg error'; msg.innerText = 'DOB cannot be after target date'; return; }
            
            let years = d2.getFullYear() - d1.getFullYear();
            let months = d2.getMonth() - d1.getMonth();
            let days = d2.getDate() - d1.getDate();
            
            if(days < 0) {
                months--;
                const lastMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
                days += lastMonth.getDate();
            }
            if(months < 0) {
                years--;
                months += 12;
            }
            
            const txt = `${years} Years, ${months} Months, ${days} Days`;
            res.innerText = txt;
            addHistory('Age Calculator', `DOB: ${dob}, Target: ${target}`, txt);
        });

        // BMI
        const bmiUnit = document.getElementById('bmi-unit');
        bmiUnit.addEventListener('change', () => {
            const w = document.getElementById('bmi-weight');
            const h = document.getElementById('bmi-height');
            if(bmiUnit.value === 'metric') {
                w.placeholder = 'Weight in kg'; h.placeholder = 'Height in cm';
            } else {
                w.placeholder = 'Weight in lbs'; h.placeholder = 'Height in inches';
            }
        });
        document.getElementById('btn-bmi').addEventListener('click', () => {
            const w = parseFloat(document.getElementById('bmi-weight').value);
            const h = parseFloat(document.getElementById('bmi-height').value);
            const unit = document.getElementById('bmi-unit').value;
            const msg = document.getElementById('msg-bmi');
            const res = document.getElementById('res-bmi');
            
            if(!w || !h || w <= 0 || h <= 0) { msg.className = 'msg error'; msg.innerText = 'Enter valid values'; return; }
            msg.innerText = '';
            
            let bmi = 0;
            if(unit === 'metric') {
                const hm = h / 100;
                bmi = w / (hm * hm);
            } else {
                bmi = (w / (h * h)) * 703;
            }
            
            let cat = '';
            if(bmi < 18.5) cat = 'Underweight';
            else if(bmi < 25) cat = 'Normal weight';
            else if(bmi < 30) cat = 'Overweight';
            else cat = 'Obese';
            
            const txt = `${bmi.toFixed(2)} - ${cat}`;
            res.innerText = txt;
            addHistory('BMI Calculator', `W:${w}, H:${h}`, txt);
        });

        // EMI
        document.getElementById('btn-emi').addEventListener('click', () => {
            const p = parseFloat(document.getElementById('emi-amount').value);
            const r = parseFloat(document.getElementById('emi-rate').value);
            const t = parseFloat(document.getElementById('emi-tenure').value);
            const type = document.getElementById('emi-tenureType').value;
            const msg = document.getElementById('msg-emi');
            const res = document.getElementById('res-emi');
            
            if(!p || !r || !t) { msg.className = 'msg error'; msg.innerText = 'Enter all values'; return; }
            msg.innerText = '';
            
            const n = type === 'years' ? t * 12 : t;
            const mr = r / 12 / 100;
            
            let emi = (p * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
            if(r === 0) emi = p / n;
            
            const total = emi * n;
            const interest = total - p;
            
            const txt = `EMI: ₹${emi.toFixed(2)}`;
            res.innerText = txt;
            msg.className = 'msg';
            msg.innerHTML = `Total Interest: ₹${interest.toFixed(2)}<br>Total Payment: ₹${total.toFixed(2)}`;
            addHistory('EMI Calculator', `P:${p}, R:${r}%, N:${n}m`, txt);
        });

        // Percentage
        document.getElementById('btn-percentage').addEventListener('click', () => {
            const m = document.getElementById('percentage-mode').value;
            const x = parseFloat(document.getElementById('percentage-x').value);
            const y = parseFloat(document.getElementById('percentage-y').value);
            const msg = document.getElementById('msg-percentage');
            const res = document.getElementById('res-percentage');
            
            if(isNaN(x) || isNaN(y)) { msg.className = 'msg error'; msg.innerText = 'Enter valid numbers'; return; }
            msg.innerText = '';
            
            let ans = 0;
            let expr = '';
            if(m === 'a') {
                ans = (x / 100) * y;
                expr = `${x}% of ${y}`;
            } else if(m === 'b') {
                if(y === 0) { msg.className = 'msg error'; msg.innerText = 'Y cannot be zero'; return; }
                ans = (x / y) * 100;
                expr = `${x} is what % of ${y}`;
            } else {
                if(x === 0) { msg.className = 'msg error'; msg.innerText = 'X cannot be zero'; return; }
                ans = ((y - x) / x) * 100;
                expr = `% change ${x} to ${y}`;
            }
            
            res.innerText = ans % 1 !== 0 ? ans.toFixed(4) : ans;
            if(m === 'b' || m === 'c') res.innerText += '%';
            addHistory('Percentage', expr, res.innerText);
        });

        // Discount
        document.getElementById('btn-discount').addEventListener('click', () => {
            const p = parseFloat(document.getElementById('discount-price').value);
            const d = parseFloat(document.getElementById('discount-off').value);
            const t = parseFloat(document.getElementById('discount-tax').value) || 0;
            const res = document.getElementById('res-discount');
            if(isNaN(p) || isNaN(d)) return;
            
            const offAmt = p * (d/100);
            const afterD = p - offAmt;
            const taxAmt = afterD * (t/100);
            const final = afterD + taxAmt;
            
            res.innerText = final.toFixed(2);
            document.getElementById('msg-discount').innerHTML = `Saved: ${offAmt.toFixed(2)} | Tax: ${taxAmt.toFixed(2)}`;
            addHistory('Discount', `${p} with ${d}% off + ${t}% tax`, final.toFixed(2));
        });

        // GST
        document.getElementById('btn-gst').addEventListener('click', () => {
            const mode = document.getElementById('gst-mode').value;
            const a = parseFloat(document.getElementById('gst-amount').value);
            const r = parseFloat(document.getElementById('gst-rate').value);
            const res = document.getElementById('res-gst');
            if(isNaN(a)) return;
            
            let final = 0, gst = 0, base = 0;
            if(mode === 'add') {
                gst = a * (r/100);
                final = a + gst;
                base = a;
            } else {
                base = a - (a * (100 / (100 + r)));
                gst = a - base; // Actually this is the GST removed.
                base = a - gst;
                final = base; // The original price without GST
            }
            
            res.innerText = final.toFixed(2);
            document.getElementById('msg-gst').innerHTML = `Base: ${base.toFixed(2)} | GST: ${gst.toFixed(2)}`;
            addHistory('GST', `${a} (${mode} ${r}%)`, final.toFixed(2));
        });

        // Unit logic
        const unitType = document.getElementById('unit-type');
        unitType.addEventListener('change', () => {
            const f = document.getElementById('unit-from');
            const t = document.getElementById('unit-to');
            const v = unitType.value;
            let opts = '';
            if(v === 'length') {
                opts = `<option value="km">Kilometers</option><option value="m">Meters</option><option value="cm">Centimeters</option><option value="mm">Millimeters</option>`;
            } else if (v === 'weight') {
                opts = `<option value="kg">Kilograms</option><option value="g">Grams</option><option value="mg">Milligrams</option><option value="lb">Pounds</option>`;
            } else {
                opts = `<option value="c">Celsius</option><option value="f">Fahrenheit</option><option value="k">Kelvin</option>`;
            }
            f.innerHTML = opts; t.innerHTML = opts;
        });
        document.getElementById('btn-unit').addEventListener('click', () => {
            const v = parseFloat(document.getElementById('unit-val').value);
            const f = document.getElementById('unit-from').value;
            const t = document.getElementById('unit-to').value;
            const res = document.getElementById('res-unit');
            if(isNaN(v)) return;
            
            let ans = v;
            // Simple logic for length
            if(document.getElementById('unit-type').value === 'length') {
                const toM = {km:1000, m:1, cm:0.01, mm:0.001};
                const valInM = v * toM[f];
                ans = valInM / toM[t];
            } else if (document.getElementById('unit-type').value === 'temp') {
                let c = 0;
                if(f==='f') c = (v-32)*5/9; else if(f==='k') c = v-273.15; else c = v;
                if(t==='f') ans = c*9/5 + 32; else if(t==='k') ans = c+273.15; else ans = c;
            } else {
                const toG = {kg:1000, g:1, mg:0.001, lb:453.592};
                const valInG = v * toG[f];
                ans = valInG / toG[t];
            }
            
            res.innerText = ans.toFixed(4);
            addHistory('Unit Conv', `${v} ${f} to ${t}`, res.innerText);
        });

        // Fraction
        document.getElementById('btn-fraction').addEventListener('click', () => {
            const n1 = parseFloat(document.getElementById('fraction-n1').value);
            const d1 = parseFloat(document.getElementById('fraction-d1').value);
            const op = document.getElementById('fraction-op').value;
            const n2 = parseFloat(document.getElementById('fraction-n2').value);
            const d2 = parseFloat(document.getElementById('fraction-d2').value);
            const res = document.getElementById('res-fraction');
            
            if(isNaN(n1)||isNaN(d1)||isNaN(n2)||isNaN(d2)||d1===0||d2===0) return;
            
            let rn=0, rd=1;
            if(op==='+') { rn = n1*d2 + n2*d1; rd = d1*d2; }
            if(op==='-') { rn = n1*d2 - n2*d1; rd = d1*d2; }
            if(op==='*') { rn = n1*n2; rd = d1*d2; }
            if(op==='/') { rn = n1*d2; rd = d1*n2; }
            
            const gcd = (a, b) => b ? gcd(b, a % b) : a;
            const g = Math.abs(gcd(rn, rd));
            
            if(rd/g === 1) res.innerText = `${rn/g}`;
            else res.innerText = `${rn/g} / ${rd/g}`;
            
            addHistory('Fraction', `${n1}/${d1} ${op} ${n2}/${d2}`, res.innerText);
        });

        // Ratio
        document.getElementById('btn-ratio').addEventListener('click', () => {
            const a = parseFloat(document.getElementById('ratio-a').value);
            const b = parseFloat(document.getElementById('ratio-b').value);
            if(isNaN(a)||isNaN(b)) return;
            const gcd = (x, y) => y ? gcd(y, x % y) : x;
            const g = Math.abs(gcd(a, b));
            const r = `${a/g} : ${b/g}`;
            document.getElementById('res-ratio').innerText = r;
            addHistory('Ratio', `${a}:${b}`, r);
        });

        // Profit & Loss
        document.getElementById('btn-profit-loss').addEventListener('click', () => {
            const cp = parseFloat(document.getElementById('profit-loss-cp').value);
            const sp = parseFloat(document.getElementById('profit-loss-sp').value);
            const res = document.getElementById('res-profit-loss');
            if(isNaN(cp)||isNaN(sp)||cp<=0) return;
            
            if(sp > cp) {
                const p = sp - cp;
                const pp = (p/cp)*100;
                res.innerText = `Profit: ${p.toFixed(2)} (${pp.toFixed(2)}%)`;
            } else if (cp > sp) {
                const l = cp - sp;
                const lp = (l/cp)*100;
                res.innerText = `Loss: ${l.toFixed(2)} (${lp.toFixed(2)}%)`;
            } else {
                res.innerText = 'No Profit No Loss';
            }
            addHistory('P&L', `CP:${cp}, SP:${sp}`, res.innerText);
        });

        // Tip
        document.getElementById('btn-tip').addEventListener('click', () => {
            const b = parseFloat(document.getElementById('tip-bill').value);
            const t = parseFloat(document.getElementById('tip-tipPercent').value);
            const p = parseFloat(document.getElementById('tip-people').value) || 1;
            if(isNaN(b)||isNaN(t)) return;
            
            const tipAmt = b * (t/100);
            const total = b + tipAmt;
            const pp = total / p;
            
            document.getElementById('res-tip').innerText = total.toFixed(2);
            document.getElementById('msg-tip').innerHTML = `Tip: ${tipAmt.toFixed(2)}<br>Per Person: ${pp.toFixed(2)}`;
            addHistory('Tip', `Bill:${b}, Tip:${t}%, Ppl:${p}`, `Total:${total.toFixed(2)}`);
        });

        // Fuel
        document.getElementById('btn-fuel').addEventListener('click', () => {
            const d = parseFloat(document.getElementById('fuel-dist').value);
            const m = parseFloat(document.getElementById('fuel-mil').value);
            const p = parseFloat(document.getElementById('fuel-price').value);
            if(isNaN(d)||isNaN(m)||isNaN(p)||m===0) return;
            
            const req = d / m;
            const cost = req * p;
            
            document.getElementById('res-fuel').innerText = cost.toFixed(2);
            document.getElementById('msg-fuel').innerHTML = `Fuel Required: ${req.toFixed(2)} units`;
            addHistory('Fuel', `D:${d}, M:${m}, P:${p}`, cost.toFixed(2));
        });

        // Simple Interest
        document.getElementById('btn-simple-interest').addEventListener('click', () => {
            const p = parseFloat(document.getElementById('simple-interest-p').value);
            const r = parseFloat(document.getElementById('simple-interest-r').value);
            const t = parseFloat(document.getElementById('simple-interest-t').value);
            if(isNaN(p)||isNaN(r)||isNaN(t)) return;
            const si = (p * r * t) / 100;
            const amount = p + si;
            document.getElementById('res-simple-interest').innerText = `₹${amount.toFixed(2)}`;
            document.getElementById('msg-simple-interest').innerHTML = `Interest: ₹${si.toFixed(2)}`;
            addHistory('Simple Interest', `P:${p}, R:${r}%, T:${t}y`, `₹${amount.toFixed(2)}`);
        });

        // Compound Interest
        document.getElementById('btn-compound-interest').addEventListener('click', () => {
            const p = parseFloat(document.getElementById('compound-interest-p').value);
            const r = parseFloat(document.getElementById('compound-interest-r').value);
            const t = parseFloat(document.getElementById('compound-interest-t').value);
            const n = parseFloat(document.getElementById('compound-interest-n').value) || 1;
            if(isNaN(p)||isNaN(r)||isNaN(t)) return;
            const amount = p * Math.pow((1 + (r/100)/n), n * t);
            const ci = amount - p;
            document.getElementById('res-compound-interest').innerText = `₹${amount.toFixed(2)}`;
            document.getElementById('msg-compound-interest').innerHTML = `Interest: ₹${ci.toFixed(2)}`;
            addHistory('Compound Interest', `P:${p}, R:${r}%, T:${t}y, N:${n}`, `₹${amount.toFixed(2)}`);
        });

        // Currency Converter (Static Rates)
        document.getElementById('btn-currency').addEventListener('click', () => {
            const val = parseFloat(document.getElementById('currency-amount').value);
            const from = document.getElementById('currency-from').value;
            const to = document.getElementById('currency-to').value;
            if(isNaN(val)) return;
            const rates = { USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.2, JPY: 150.1, AUD: 1.54, CAD: 1.36, AED: 3.67, SGD: 1.35 };
            const inUSD = val / rates[from];
            const result = inUSD * rates[to];
            document.getElementById('res-currency').innerText = `${result.toFixed(2)} ${to}`;
            document.getElementById('msg-currency').innerText = 'Using demo static rates';
            addHistory('Currency', `${val} ${from} to ${to}`, `${result.toFixed(2)} ${to}`);
        });

        // GPA / CGPA
        document.getElementById('btn-gpa').addEventListener('click', () => {
            const gradePoints = { 'A+': 4.0, 'A': 4.0, 'B+': 3.3, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0 };
            let totalPts = 0;
            let totalCred = 0;
            for(let i=1; i<=3; i++) {
                const g = document.getElementById(`gpa-s${i}`).value.toUpperCase();
                const c = parseFloat(document.getElementById(`gpa-c${i}`).value);
                if(g && !isNaN(c) && gradePoints[g] !== undefined) {
                    totalPts += gradePoints[g] * c;
                    totalCred += c;
                }
            }
            if(totalCred === 0) return;
            const gpa = totalPts / totalCred;
            document.getElementById('res-gpa').innerText = gpa.toFixed(2);
            document.getElementById('msg-gpa').innerText = `Total Credits: ${totalCred}`;
            addHistory('GPA', `Total Credits: ${totalCred}`, gpa.toFixed(2));
        });

        // Marks / Percentage
        document.getElementById('btn-marks').addEventListener('click', () => {
            const obt = parseFloat(document.getElementById('marks-obtained').value);
            const tot = parseFloat(document.getElementById('marks-total').value);
            if(isNaN(obt)||isNaN(tot)||tot===0) return;
            const pct = (obt / tot) * 100;
            document.getElementById('res-marks').innerText = `${pct.toFixed(2)}%`;
            addHistory('Marks', `${obt}/${tot}`, `${pct.toFixed(2)}%`);
        });

        // Data Storage
        document.getElementById('btn-data').addEventListener('click', () => {
            const val = parseFloat(document.getElementById('data-val').value);
            const from = document.getElementById('data-from').value;
            const to = document.getElementById('data-to').value;
            if(isNaN(val)) return;
            const sizes = { bit: 1, B: 8, KB: 8*1024, MB: 8*Math.pow(1024,2), GB: 8*Math.pow(1024,3), TB: 8*Math.pow(1024,4), PB: 8*Math.pow(1024,5) };
            const inBits = val * sizes[from];
            const result = inBits / sizes[to];
            let displayRes = result.toString();
            if (displayRes.length > 12 || displayRes.includes('e')) {
                displayRes = result.toPrecision(6);
            }
            document.getElementById('res-data').innerText = displayRes;
            addHistory('Data Storage', `${val} ${from} to ${to}`, displayRes);
        });

        // Time Calculator
        document.getElementById('btn-time').addEventListener('click', () => {
            const t1 = document.getElementById('time-t1').value;
            const op = document.getElementById('time-op').value;
            const t2 = document.getElementById('time-t2').value;
            if(!t1 || !t2) return;
            
            const parseTime = (str) => {
                const [h, m] = str.split(':').map(Number);
                return h * 60 + m;
            };

            const formatTime = (totalMins) => {
                let h = Math.floor(Math.abs(totalMins) / 60);
                let m = Math.abs(totalMins) % 60;
                const sign = totalMins < 0 ? '-' : '';
                return `${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            };

            const min1 = parseTime(t1);
            const min2 = parseTime(t2);
            let res = '';

            if (op === 'diff') {
                let diff = Math.abs(min2 - min1);
                res = `${Math.floor(diff/60)} Hours, ${diff%60} Minutes`;
            } else if (op === 'add') {
                let total = (min1 + min2) % (24*60);
                res = formatTime(total);
            } else if (op === 'sub') {
                let total = (min1 - min2);
                if (total < 0) total += 24*60;
                res = formatTime(total);
            }
            document.getElementById('res-time').innerText = res;
            addHistory('Time', `${t1} ${op} ${t2}`, res);
        });

        // Date Calculator
        document.getElementById('btn-date').addEventListener('click', () => {
            const d1 = document.getElementById('date-d1').value;
            const op = document.getElementById('date-op').value;
            const val = document.getElementById('date-val').value;
            if(!d1 || !val) return;

            const date1 = new Date(d1);
            let res = '';

            if (op === 'diff') {
                const date2 = new Date(val);
                if(isNaN(date2.getTime())) {
                    document.getElementById('res-date').innerText = "Invalid end date format";
                    return;
                }
                const diffTime = Math.abs(date2 - date1);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                res = `${diffDays} Days`;
            } else {
                const days = parseInt(val);
                if(isNaN(days)) return;
                const newDate = new Date(date1);
                if(op === 'add') {
                    newDate.setDate(newDate.getDate() + days);
                } else if(op === 'sub') {
                    newDate.setDate(newDate.getDate() - days);
                }
                res = newDate.toISOString().split('T')[0];
            }
            document.getElementById('res-date').innerText = res;
            addHistory('Date', `${d1} ${op} ${val}`, res);
        });

        // Countdown
        document.getElementById('btn-countdown').addEventListener('click', () => {
            const t = document.getElementById('countdown-target').value;
            if(!t) return;
            const diff = new Date(t) - new Date();
            if(diff <= 0) {
                document.getElementById('res-countdown').innerText = 'Date has passed';
                return;
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const weeks = Math.floor(days / 7);
            const approxMonths = Math.floor(days / 30);
            
            document.getElementById('res-countdown').innerText = `${days} Days`;
            document.getElementById('msg-countdown').innerHTML = `Approx ${weeks} weeks or ${approxMonths} months`;
            addHistory('Countdown', `To ${t}`, `${days} Days`);
        });

    }

    // ==========================================
    // STANDARD / SCIENTIFIC ENGINE
    // ==========================================
    
    class CalculatorEngine {
        constructor(isSci = false) {
            this.isSci = isSci;
            this.valEl = document.getElementById(isSci ? 'sci-val' : 'basic-val');
            this.exprEl = document.getElementById(isSci ? 'sci-expr' : 'basic-expr');
            this.reset();
            this.degMode = true;
        }
        
        reset() {
            this.expr = '';
            this.curr = '0';
            this.newOp = false;
            this.updateUI();
        }

        ac() { this.reset(); }
        
        del() {
            if(this.curr === 'Error') { this.reset(); return; }
            if(this.newOp) return;
            this.curr = this.curr.slice(0, -1);
            if(this.curr === '' || this.curr === '-') this.curr = '0';
            this.updateUI();
        }
        
        num(n) {
            if(this.curr === 'Error') this.reset();
            if(this.newOp) {
                this.curr = '';
                this.newOp = false;
            }
            if(n === '.' && this.curr.includes('.')) return;
            if(this.curr === '0' && n !== '.' && n !== '00') {
                this.curr = n;
            } else {
                this.curr += n;
            }
            this.updateUI();
        }
        
        toggleSign() {
            if(this.curr === '0' || this.curr === 'Error') return;
            if(this.curr.startsWith('-')) this.curr = this.curr.substring(1);
            else this.curr = '-' + this.curr;
            this.updateUI();
        }

        const(c) {
            if(this.newOp) this.curr = '';
            this.curr = c === 'PI' ? Math.PI.toString() : Math.E.toString();
            this.newOp = true;
            this.updateUI();
        }

        op(o) {
            if(this.curr === 'Error') this.reset();
            // Just basic string building for eval replacement
            if(!this.newOp && this.curr !== '') {
                this.expr += this.curr + ' ' + o + ' ';
            } else if(this.expr !== '') {
                this.expr = this.expr.slice(0, -2) + o + ' ';
            } else {
                this.expr = '0 ' + o + ' ';
            }
            this.newOp = true;
            this.updateUI();
        }

        func(f) {
            let v = parseFloat(this.curr);
            if(isNaN(v)) return;
            let res = 0;
            const r = this.degMode ? (v * Math.PI / 180) : v;
            
            try {
                switch(f) {
                    case 'sin': res = Math.sin(r); break;
                    case 'cos': res = Math.cos(r); break;
                    case 'tan': res = Math.tan(r); break;
                    case 'asin': res = this.degMode ? (Math.asin(v) * 180 / Math.PI) : Math.asin(v); break;
                    case 'acos': res = this.degMode ? (Math.acos(v) * 180 / Math.PI) : Math.acos(v); break;
                    case 'atan': res = this.degMode ? (Math.atan(v) * 180 / Math.PI) : Math.atan(v); break;
                    case 'log': res = Math.log10(v); break;
                    case 'ln': res = Math.log(v); break;
                    case 'sqrt': res = Math.sqrt(v); break;
                    case 'cbrt': res = Math.cbrt(v); break;
                    case 'sqr': res = v * v; break;
                    case 'cube': res = v * v * v; break;
                    case 'inv': if(v===0)throw 'err'; res = 1/v; break;
                    case 'fact': 
                        if(v < 0 || !Number.isInteger(v)) throw 'err';
                        res = 1; for(let i=2; i<=v; i++) res*=i; 
                        break;
                }
                this.curr = this.formatRes(res);
                this.newOp = true;
                this.updateUI();
            } catch(e) {
                this.curr = 'Error';
                this.updateUI();
            }
        }

        toggleMode() {
            this.degMode = !this.degMode;
            document.getElementById('sci-mode-btn').innerText = this.degMode ? 'DEG' : 'RAD';
        }

        eq() {
            if(this.expr === '' && !this.expr.includes('(')) return; // simplify
            let fullExpr = this.expr + this.curr;
            try {
                let res = this.safeEval(fullExpr);
                if(!isFinite(res) || isNaN(res)) throw 'err';
                const finalRes = this.formatRes(res);
                addHistory(this.isSci ? 'Scientific' : 'Basic', fullExpr, finalRes);
                this.expr = '';
                this.curr = finalRes;
                this.newOp = true;
                this.updateUI();
            } catch (e) {
                this.curr = 'Error';
                this.updateUI();
            }
        }

        safeEval(expr) {
            // Very basic parser replacing eval
            expr = expr.replace(/×/g, '*').replace(/÷/g, '/');
            // Tokenizer and shunting yard could be implemented here for real robustness
            // For now, simple Function approach but prompt says "no eval". 
            // We'll write a small math evaluator.
            
            // Simple split for basic operations just to fulfill basic need without eval.
            // If it's a complex scientific expression, we need proper parsing.
            // Using Function constructor is akin to eval.
            // So let's build a tiny recursive descent parser.
            return this.parseExpr(expr);
        }

        parseExpr(s) {
            // Strip spaces
            s = s.replace(/\s+/g, '');
            let pos = 0;

            const parseFactor = () => {
                if(pos >= s.length) return 0;
                let sign = 1;
                if(s[pos] === '-') { sign = -1; pos++; }
                else if(s[pos] === '+') { pos++; }
                
                let res = 0;
                if(s[pos] === '(') {
                    pos++;
                    res = parseExprAddSub();
                    if(s[pos] === ')') pos++;
                } else {
                    let start = pos;
                    while(pos < s.length && (/[0-9.]/.test(s[pos]) || s[pos]==='E' || (s[pos]==='-' && s[pos-1]==='E') || (s[pos]==='+' && s[pos-1]==='E'))) {
                        pos++;
                    }
                    res = parseFloat(s.slice(start, pos));
                }
                return res * sign;
            };

            const parseTerm = () => {
                let res = parseFactor();
                while(pos < s.length) {
                    if(s[pos] === '*') { pos++; res *= parseFactor(); }
                    else if(s[pos] === '/') { pos++; res /= parseFactor(); }
                    else if(s[pos] === '^') { pos++; res = Math.pow(res, parseFactor()); }
                    else if(s[pos] === '%') { pos++; res = res % parseFactor(); }
                    else break;
                }
                return res;
            };

            const parseExprAddSub = () => {
                let res = parseTerm();
                while(pos < s.length) {
                    if(s[pos] === '+') { pos++; res += parseTerm(); }
                    else if(s[pos] === '-') { pos++; res -= parseTerm(); }
                    else break;
                }
                return res;
            };

            return parseExprAddSub();
        }

        formatRes(n) {
            let resStr = n.toString();
            if(resStr.length > 12 && !resStr.includes('e')) {
                return parseFloat(n.toPrecision(10)).toString();
            }
            return resStr;
        }

        updateUI() {
            this.valEl.innerText = this.curr;
            this.exprEl.innerText = this.expr;
        }
    }

    window.basicCalc = new CalculatorEngine(false);
    window.sciCalc = new CalculatorEngine(true);

    // Keyboard support for active calculator
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        const activeView = document.querySelector('.calc-view.active');
        if(!activeView) return;
        const id = activeView.id;
        
        if(id === 'view-basic' || id === 'view-scientific') {
            const calc = id === 'view-basic' ? basicCalc : sciCalc;
            if(/[0-9]/.test(key)) calc.num(key);
            else if(key === '.') calc.num('.');
            else if(key === '+' || key === '-' || key === '*' || key === '/') calc.op(key);
            else if(key === '%') calc.op('%');
            else if(key === 'Enter' || key === '=') { e.preventDefault(); calc.eq(); }
            else if(key === 'Backspace') calc.del();
            else if(key === 'Escape') calc.ac();
            else if(key === '(' || key === ')') calc.num(key);
        }
    });

});
