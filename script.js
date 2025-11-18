function getPrices() {
    return {
        tovarPrices: {
            'tovar1': 7000, 
            'tovar2': 2500, 
            'tovar3': 2000  
        },
        optionMultipliers: {
            'option1': 700,   
            'option2': 400, 
            'option3': 0
        },
        propAdditions: {
            'prop1': 8000, 
            'prop2': 5000  
        }
    };
}

function toggleVisibility() {
    const tovarSelect = document.querySelector('select[name="select1"]');
    const selectedTovar = tovarSelect.value;
    const radiosDiv = document.getElementById('radios');
    const checkboxesDiv = document.getElementById('checkboxes');

    switch (selectedTovar) {
        case 'tovar1':
            radiosDiv.style.display = 'none';
            checkboxesDiv.style.display = 'none';
            break;
        case 'tovar2':
            radiosDiv.style.display = 'block';
            checkboxesDiv.style.display = 'none';
            break;
        case 'tovar3':
            radiosDiv.style.display = 'none';
            checkboxesDiv.style.display = 'block';
            break;
        default:
            radiosDiv.style.display = 'none';
            checkboxesDiv.style.display = 'none';
            break;
    }
    
    updatePrice(); 
}

function getUnitCost() {
    const prices = getPrices(); 
    
    let tovarKey = document.querySelector('select[name="select1"]').value; // значение из выпадающего списка
    let unitPrice = prices.tovarPrices[tovarKey]; 
    
    const radiosDiv = document.getElementById('radios');
    if (radiosDiv.style.display !== 'none') {
        let selectedOptionRadio = document.querySelector('input[name="prodOptions"]:checked');
        if (selectedOptionRadio) {
            let optionKey = selectedOptionRadio.value;
            const multiplier = prices.optionMultipliers[optionKey];
            unitPrice = unitPrice + multiplier;
        }
    }7

    const checkboxesDiv = document.getElementById('checkboxes');
    if (checkboxesDiv.style.display !== 'none') {
        let checkboxes = document.querySelectorAll("#checkboxes input[type='checkbox']");
        checkboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
                let propKey = checkbox.name; // prop1, prop2
                const propCost = prices.propAdditions[propKey];
                if (propCost !== undefined) {
                    unitPrice = unitPrice + propCost; 
                }
            }
        });
    }

    return unitPrice;
}

function updatePrice() {
    const countInput = document.querySelector('#countInput');
    const resultElement = document.getElementById("result");
    

    const inputValue = countInput.value.trim();
    

    const truestr = /^\d+$/; 

    if (inputValue === '') {
        countInput.style.border = ''; 
        resultElement.innerHTML = '';
        resultElement.style.display = 'none';

        return; 
    }


    if (inputValue.match(truestr) === null || inputValue === '0') {
        countInput.style.border = '2px solid red';
        resultElement.innerHTML = '<span style="color: red;">❌ Ошибка! Введите натуральные числа!</span>';
        resultElement.style.color = "red";
        resultElement.style.display = 'block';
        
        return; // Прекращаем выполнение функции
    }
    
    countInput.style.border = '2px solid green'; 
    let count = parseInt(inputValue); // из строки в число
    
    let unitCost = getUnitCost(); 
    let totalCost = count * unitCost;
    
    resultElement.innerHTML = `✅ Количество: ${count}. Стоимость: ${totalCost} руб.`;
    resultElement.style.color = "green";
    resultElement.style.display = 'block'; 
}

window.addEventListener('DOMContentLoaded', function () {
    const selectElement = document.querySelector('select[name="select1"]');
    const updateEvents = ['input', 'change']; 

    [
        document.querySelector('#countInput'), 
        selectElement, 
        ...document.querySelectorAll('input[name="prodOptions"]'),
        ...document.querySelectorAll('#checkboxes input[type="checkbox"]')
    ].forEach(element => {
        if (element === selectElement) {
            element.addEventListener('change', function() {
                toggleVisibility(); // toggleVisibility вызывает updatePrice
            });
        } else {
            element.addEventListener('change', updatePrice);
            if (element.id === 'countInput') {
                element.addEventListener('input', updatePrice);
            }
        }
    });

    toggleVisibility(); // Вызывает updatePrice
});