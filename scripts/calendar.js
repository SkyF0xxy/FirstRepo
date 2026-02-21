const monthNames = [
    'January', 
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getById(id){
    return document.getElementById(id)
}

let date = new Date()

let curMonth ={
    month: date.getMonth(),
    year: date.getFullYear()
}

let nextMonth = {
    month: date.getMonth() === 11 ? 0 : date.getMonth() + 1,
    year: date.getMonth() === 11 ? date.getFullYear() + 1 : date.getFullYear()
}

function showMonth({year, month}){
    console.log('showMonth вызван для:', monthNames[month], year)
    const calendar = document.createElement('div')
    calendar.classList.add('days')
    // Убрали id='days' чтобы не было дублей

    const monthTitle = document.createElement('div')
    monthTitle.classList.add('month-title')
    monthTitle.textContent = `${monthNames[month]} ${year}`
    

    let firstDayOfMonth = new Date(year, month, 1).getDay()
    // Корректируем: JS getDay() возвращает 0 для воскресенья, но у нас неделя начинается с понедельника
    firstDayOfMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1
    let lastDayOfMonth = new Date(year, month + 1, 0).getDate()

    for(let i = 1; i <= lastDayOfMonth; i+=1) {
        //предыдущие дни месяца
        if(i === 1){
            for(let j = 0; j < firstDayOfMonth; j+=1){
                let day = document.createElement('div')
                day.classList.add('day-title')
                calendar.append(day)
            }
        }
        // актуальные дньи месяца
        let day = document.createElement('div')
        day.textContent = i
        day.classList.add('day-title')

        //призывают функцию для выделения дней
        day.dataset.date = new Date(year, month, i).toLocaleDateString()
        day.addEventListener('click', () => {
           paintDay(day)
        })
        allDays.push(day)
        calendar.append(day)

        //дни следующего месяца
        if(i === lastDayOfMonth){
            let remainDays = new Date(year, month, i).getDay()
            // Корректируем: 0 (вс) -> 6, 1 (пн) -> 0, и т.д.
            remainDays = remainDays === 0 ? 6 : remainDays - 1
            // Добавляем пустые дни до конца недели
            for(let j = remainDays + 1; j < 7; j+=1){
                let day = document.createElement('div')
                day.classList.add('day-title')
                calendar.append(day)
            }
        }
    }

    const monthBlock = document.createElement('div')
    monthBlock.classList.add('month')
    monthBlock.append(monthTitle, createDaysTitle(), calendar)

    getById('month-box').append(monthBlock)
    console.log('Блок месяца добавлен:', monthNames[month], 'Дней в allDays:', allDays.length)
}

let counterClick = 0
let allDays = []
let clickedDays = []
let betweenDays = []



function paintDay(day){
    // если кликнули на уже выделенный день, то снимаем выделение
    if(counterClick >1){
        resetPaintedDays()
    }
    //Запрет выбора дня меньшк чем текущий
    if(clickedDays.length && day.dataset.date < clickedDays[0].dataset.date){
        return
    }
    clickedDays.push(day)

    if(counterClick === 1){
        let first = allDays.indexOf(clickedDays[0])
        let last = allDays.indexOf(clickedDays[1])
        betweenDays = allDays.slice(first + 1, last)
        betweenDays.forEach(item => item.style.backgroundColor = 'lightblue')
    }

    day.style.backgroundColor = 'blue'
    counterClick+=1
}

function createDaysTitle(){
    const daysTitle = document.createElement('div')
    daysTitle.classList.add('daysTitle')

    daysOfWeek.forEach(item => {
        let day = document.createElement('div')
        day.textContent = item
        day.classList.add('day-title')
        daysTitle.append(day)
    })

    return daysTitle
}


function showNextMonth(){
    if(curMonth.month === 11){
        curMonth.month = 0
        curMonth.year += 1
    } else {
        curMonth.month += 1
    }

    if(nextMonth.month === 11){
        nextMonth.month = 0
        nextMonth.year += 1
    } else {
        nextMonth.month += 1
    }
    clearBlock()
    createMonthes()
}
function showPrevMonth(){
    if(curMonth.month === 0){
        curMonth.month = 11
        curMonth.year -= 1
    } else {
        curMonth.month -= 1
    }

    if(nextMonth.month === 0){
        nextMonth.month = 11
        nextMonth.year -= 1
    } else {
        nextMonth.month -= 1
    }
    clearBlock()
    createMonthes()
}

function createMonthes(){
    console.log('createMonthes: создаем календари для', curMonth, nextMonth)
    showMonth(curMonth)
    showMonth(nextMonth)
    console.log('Календари созданы, элементов в month-box:', getById('month-box').children.length)
}

function createCalendar(){
    createMonthes()
    getById('next').addEventListener('click', showNextMonth)
    getById('prev').addEventListener('click', showPrevMonth)
}

function clearBlock(){
    getById('month-box').innerHTML = ''
    // Очищаем массив дней при переключении месяцев
    allDays = []
    // Сбрасываем выбор дней
    counterClick = 0
    clickedDays = []
    betweenDays = []
}

createCalendar()

let showCalendar = false

function toggleCalendar(){
   const calendar = getById('calendar')
   console.log('toggleCalendar вызван, showCalendar ДО:', showCalendar)
   
   // Сначала переключаем флаг
   showCalendar = !showCalendar
   
   // Потом применяем новое состояние
   if(showCalendar){
        calendar.style.display = 'block'
        console.log('Календарь показан, showCalendar ПОСЛЕ:', showCalendar)
    } else {
        calendar.style.display = 'none'
        console.log('Календарь скрыт, showCalendar ПОСЛЕ:', showCalendar)
    }
}

// Скрываем календарь при загрузке страницы
const calendarEl = getById('calendar')
if(calendarEl) {
    calendarEl.style.display = 'none'
    console.log('Календарь скрыт при загрузке')
}

// Открываем календарь при клике на поля дат
const departSpanEl = getById('depart')
const returnSpanEl = getById('return')

console.log('Элементы найдены:', {
    depart: departSpanEl,
    return: returnSpanEl,
    calendar: calendarEl
})

if(departSpanEl && returnSpanEl) {
    // Добавляем курсор pointer
    departSpanEl.style.cursor = 'pointer'
    returnSpanEl.style.cursor = 'pointer'
    departSpanEl.parentElement.style.cursor = 'pointer'
    returnSpanEl.parentElement.style.cursor = 'pointer'

    // Обработчики ТОЛЬКО на родительские элементы, чтобы не было двойного срабатывания
    departSpanEl.parentElement.addEventListener('click', (e) => {
        console.log('Клик на depart, showCalendar:', showCalendar)
        e.stopPropagation()
        if(!showCalendar) {
            toggleCalendar()
        }
    })
    returnSpanEl.parentElement.addEventListener('click', (e) => {
        console.log('Клик на return, showCalendar:', showCalendar)
        e.stopPropagation()
        if(!showCalendar) {
            toggleCalendar()
        }
    })
    
    console.log('Обработчики добавлены')
} else {
    console.error('Элементы depart или return не найдены!')
}

const resetBtn = getById('reset')
const applyBtn = getById('apply')

function resetPaintedDays(withSpans) {
        counterClick = 0
        clickedDays.forEach(item => item.style.backgroundColor = 'inherit')
        clickedDays = []
        betweenDays.forEach(item => item.style.backgroundColor = 'inherit')
        betweenDays = []

        if(withSpans){
            returnSpanEl.textContent = 'Return'
            departSpanEl.textContent = 'Depart'
        }
}

applyBtn.addEventListener('click', () => {
    if(clickedDays.length !== 2){
        return
    }
    const [departDate, returnDate] = clickedDays
    departSpanEl.textContent = departDate.dataset.date
    returnSpanEl.textContent = returnDate.dataset.date

    toggleCalendar()
})

resetBtn.addEventListener('click', () => {
    resetPaintedDays(true)
    toggleCalendar()
}

)
