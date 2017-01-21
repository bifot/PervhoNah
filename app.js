const request = require('request');

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Токен ВК
const token = 'YOUR_TOKEN';

// Сообщения, которые нужно постить
const message = [
  'Хорошо быть умным. 🚁',
  'Пора агрить даунов, которые не первые 🚁',
  'Ну что, опять пытаешься попасть в ТОП-комметариев, чмо?(',
  'Передаю привет Милене Оганесян! Люблю ее. 💋'
];

// Нужные паблики, в которых будем первыми
const publics = [
  'pravda.show',
  'ytber',
  'pv_vb',
  'why4ch'
];

const beFirst = group => {
  request(`https://api.vk.com/method/groups.getById?group_id=${group}&v=5.60`, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var json = JSON.parse(body);
      var id = json.response[0].id;

      setInterval(() => {
        console.log(`Проверяем стену ${group}...`);

        request(`https://api.vk.com/method/wall.get?owner_id=-${id}&count=3&v=5.60`, (error, response, body) => {
          if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);

            var items = json.response.items;

            items.forEach(post => {
              var countComments = post.comments.count;
              var postId = post.id;

              if (countComments < 5) {
                request(`https://api.vk.com/method/wall.createComment?owner_id=-${id}&post_id=${postId}&message=${encodeURIComponent(message[getRandomInt(0, message.length - 1)])}&access_token=${token}&v=5.60`, (error, response, body) => {
                  if (!error && response.statusCode == 200) {
                    var json = JSON.parse(body);

                    if (json.response) {
                      console.log(`Комментарий к посту https://vk.com/wall-${id}_${postId} успешно написан.`);
                    } else {
                      console.log(`Ошибка: ${json.error.error_msg}`);
                    }
                  } else {
                    console.log('Ошибка при постинге комментария.');
                  }
                });
              }
            });
          } else {
            console.log('Ошибка при парсинге записей.');
          }
        });
      }, 3000);
    } else {
      console.log('Ошибка при получении информации о сообществе.');
    }
  });
};

publics.forEach(public => {
  beFirst(public);
});