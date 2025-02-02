document.addEventListener('DOMContentLoaded', function () {
    const editorLink = document.getElementById('editorLink');
    const usersLink = document.getElementById('usersLink');
    const monitoringLink = document.getElementById('monitoringLink');
    const backendLink = document.getElementById('backendLink');
    const searchLink = document.getElementById('searchLink');
    const content = document.getElementById('content');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const burgerButton = document.getElementById('burgerButton');

    function setActive(link) {
        document.querySelectorAll('.sidebar .nav-link').forEach(btn => btn.classList.remove('active'));
        link.classList.add('active');
    }

    burgerButton.addEventListener('click', function () {
        sidebarMenu.classList.toggle('open');
    });

    function closeMenu() {
        sidebarMenu.classList.remove('open');
    }

    usersLink.addEventListener('click', function (event) {
event.preventDefault();
setActive(usersLink);
closeMenu();

// Показываем сообщение о загрузке
content.innerHTML = '<div class="alert alert-info">Загрузка данных, пожалуйста, подождите...</div>';

fetch('https://sanich-code.github.io/BN/users.json')
    .then(response => response.json())
    .then(data => {
        content.innerHTML = ''; // Очищаем сообщение

        const usersArray = Object.keys(data).map(userId => ({
            id: userId,
            ...data[userId]
        }));

        const table = document.createElement('table');
        table.className = 'table table-bordered table-striped table-responsive';

        const thead = document.createElement('thead');
        const theadRow = document.createElement('tr');
        Object.keys(usersArray[0]).forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            theadRow.appendChild(th);
        });
        thead.appendChild(theadRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        usersArray.forEach(user => {
            const row = document.createElement('tr');
            Object.values(user).forEach(value => {
                const td = document.createElement('td');
                td.textContent = value;
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        content.appendChild(table);
    })
    .catch(error => {
        content.innerHTML = `<div class="alert alert-danger">Ошибка загрузки данных: ${error.message}</div>`;
    });
});

    editorLink.addEventListener('click', function (event) {
        event.preventDefault();
        setActive(editorLink);
        closeMenu();
        content.innerHTML = '<p>Редактор пока не реализован.</p>';
    });
    backendLink.addEventListener("click", function (event) {
event.preventDefault();
setActive(backendLink);
closeMenu();

content.innerHTML = `
    <div class="container">
        <h3 class="mb-3" id="panelTitle">Панель BackEnd</h3>
        <div class="d-grid gap-2" id="buttonContainer">
            <button class="btn btn-primary btn-lg backend-btn" data-url="/backend/post">📩 Отправить POST-запрос</button>
            <button class="btn btn-warning btn-lg backend-btn" data-url="/backend/logs">📜 Логи сервера</button>
            <button class="btn btn-danger btn-lg backend-btn" data-url="/backend/restart">🔄 Перезагрузить сервер 🚬</button>
        </div>
        <div id="mobileStatus" class="backend-mobile-status d-none">Ожидание...</div>
        <div id="backendFrameContainer" class="mt-4 text-center">
            <p class="alert alert-secondary backend-status">Ожидание...</p>
        </div>
    </div>
`;

// Функция для обработки клика по кнопке
function handleButtonClick(button) {
    const url = button.getAttribute("data-url");
    const container = document.getElementById("backendFrameContainer");
    const mobileStatus = document.getElementById("mobileStatus");
    const buttonContainer = document.getElementById("buttonContainer");
    const panelTitle = document.getElementById("panelTitle");

    // Скрываем все кнопки
    buttonContainer.innerHTML = "";

    // Показываем "Ожидание" на мобильных
    if (window.innerWidth < 992) {
        mobileStatus.classList.remove("d-none");
    }

    // Показываем анимацию загрузки
    container.innerHTML = `<div class="alert alert-info">⏳ Выполняется запрос...</div>`;

    setTimeout(() => {
        // Вставляем iframe и изменяем его высоту
        container.innerHTML = `<iframe class="siframe" src="${url}" width="100%" height="60px" class="border border-primary"></iframe>`;

 
        // Через 5 секунд скрываем iframe и возвращаем "Ожидание"
        setTimeout(() => {
            container.innerHTML = `<p class="alert alert-secondary backend-status">Ожидание...</p>`;

            // Скрываем "Ожидание" на мобильных
            if (window.innerWidth < 992) {
                mobileStatus.classList.add("d-none");
            }

            // Восстанавливаем кнопки
            buttonContainer.innerHTML = `
                <button class="btn btn-primary btn-lg backend-btn" data-url="/backend/post">📩 Отправить POST-запрос</button>
                <button class="btn btn-warning btn-lg backend-btn" data-url="/backend/logs">📜 Логи сервера</button>

                <button class="btn btn-danger btn-lg backend-btn" data-url="/backend/restart">🔄 Перезагрузить сервер 🚬</button>
              
            `;
            
            // Повторно привязываем события
            document.querySelectorAll(".backend-btn").forEach((button) => {
                button.removeEventListener("click", handleButtonClick);
                button.addEventListener("click", function () {
                    handleButtonClick(button);
                });
            });
        }, 5000); // Имитация задержки запроса
    }, 1500); // Имитация задержки запроса
}

// Привязываем события к кнопкам
document.querySelectorAll(".backend-btn").forEach((button) => {
    button.addEventListener("click", function () {
        handleButtonClick(button);
    });

});
});



    monitoringLink.addEventListener('click', function (event) {
        event.preventDefault();
        setActive(monitoringLink);
        closeMenu();
        content.innerHTML = `<iframe src="datacenter/index.html" width="100%" height="600px"></iframe>`;
    });
    searchLink.addEventListener('click', function (event) {
        event.preventDefault();
        setActive(searchLink);
        closeMenu();
    
        // Очищаем и обновляем контент
        content.innerHTML = `
            <h2>Поиск пользователя</h2>
            <div class="mb-3">
                <input type="text" id="searchInput" class="form-control" placeholder="Введите ID пользователя">
            </div>
            <button id="searchButton" class="btn btn-primary">🔍 Найти</button>
            <div id="searchResult" class="mt-3"></div>
        `;
    
        document.getElementById('searchButton').addEventListener('click', function () {
            const userId = document.getElementById('searchInput').value.trim();
            const resultContainer = document.getElementById('searchResult');
    
            if (!userId) {
                resultContainer.innerHTML = `<div class="alert alert-warning">Введите ID пользователя!</div>`;
                return;
            }
    
            resultContainer.innerHTML = `<div class="alert alert-info">🔄 Ищем пользователя...</div>`;
    
            // Массив ID, для которых информация скрыта
            const hiddenUsers = ["6978792645"]; // Добавь сюда нужные ID
    
            // Проверяем, скрыт ли пользователь
            // if (hiddenUsers.includes(userId)) {
            //     resultContainer.innerHTML = `<div class="alert alert-danger">❌ Информация о пользователе скрыта!</div>`;
            //     document.getElementById('searchInput').value = ''; // Очищаем поле ввода
            //     return;
            // }
    
            // Загружаем JSON с пользователями
            fetch('https://sanich-code.github.io/BN/users.json')
                .then(response => response.json())
                .then(data => {
                    if (data[userId]) {
                        const user = data[userId];
                        const telegramLink = `https://t.me/${user.username}`;
    
                        resultContainer.innerHTML = `
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">👤 ${user.username}</h5>
                                    <p><strong>ID:</strong> ${userId}</p>
                                    <p><strong>Статус:</strong> ${user.status}</p>
                                    <p><strong>Premium:</strong> ${user.premium === "True" ? "✅" : "❌"}</p>
                                    <p><strong>Забанен:</strong> ${user.ban === "True" ? "✔  Да" : "🚫 Нет"}</p>
                                    <p><strong>Регистрация:</strong> ${user.RegDate} в ${user.RegTime}</p>
                                    <p><strong>🔗 Telegram:</strong> <a href="${telegramLink}" target="_blank">Открыть профиль</a></p>
                                </div>
                            </div>
                        `;
                        document.getElementById('searchInput').value = ''; // Очищаем поле ввода
                    } else {
                        resultContainer.innerHTML = `<div class="alert alert-danger">❌ Пользователь не найден!</div>`;
                        document.getElementById('searchInput').value = ''; // Очищаем поле ввода
                    }
                })
                .catch(error => {
                    resultContainer.innerHTML = `<div class="alert alert-danger">Ошибка загрузки данных: ${error.message}</div>`;
                });
        });
    });
    
    
    //КОНЕЦ МЕНЮ! ВСТАВЛЯТЬ ДО СЛЕД. ЗАКРЫТИЯ
});

    
    


// Авторизация пользователя
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

if (!currentUser || currentUser.status !== 'root') {
    window.location.href = '/login/';
} else {
    document.getElementById('adminName').textContent = `С возвращением, ${currentUser.username}`;
}
// if (!sessionStorage.getItem('auth_notified')) {
//         const adminName = currentUser.username;
//         const currentTime = new Date().toLocaleString('ru-RU', { hour12: false });
//         const message = encodeURIComponent(`🚨 АХТУНГ АВТОРИЗАЦИЯ\n👤 Администратор: ${adminName}\n⏳ Время: ${currentTime}`);

//         const botToken = '8112856615:AAG1N_yvRaHBpd5DblJ4uAo-cKE6QD1Pq-o'; // Твой токен бота
//         const chatId = '-1002079156732'; // ID группового чата

//         fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${message}`)
//             .then(response => response.json())
//             .then(data => {
//                 if (data.ok) {
//                     console.log("✅ Сообщение отправлено в Telegram:", data);
//                     sessionStorage.setItem('auth_notified', 'true'); // Помечаем, что сообщение отправлено
//                 } else {
//                     console.error("❌ Ошибка при отправке в Telegram:", data);
//                 }
//             })
//             .catch(error => console.error("❌ Ошибка отправки уведомления:", error));
//     }

    // Кнопка выхода
    logoutButton.addEventListener('click', function (event) {
        event.preventDefault();
        sessionStorage.removeItem('currentUser'); // Удаляем данные о пользователе
        sessionStorage.removeItem('auth_notified'); // Сбрасываем флаг отправки уведомления
        window.location.href = '/login/'; // Перенаправляем на страницу входа
    });
    
