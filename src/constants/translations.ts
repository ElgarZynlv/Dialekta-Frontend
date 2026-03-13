export type Language = 'az' | 'ru' | 'tr' | 'en';

export const LANGUAGE_NAMES: Record<Language, string> = {
  az: 'Azərbaycanca',
  ru: 'Русский',
  tr: 'Türkçe',
  en: 'English',
};

export const LANGUAGE_FLAGS: Record<Language, string> = {
  az: '🇦🇿',
  ru: '🇷🇺',
  tr: '🇹🇷',
  en: '🇬🇧',
};

export interface Translations {
  // Language screen
  chooseLanguage: string;
  languageSubtitle: string;
  continue: string;

  // Home screen
  appSubtitle: string;
  choosePhilosopher: string;
  beginConversation: string;

  // Chat screen
  back: string;
  newChat: string;
  clearChatTitle: string;
  clearChatMessage: string;
  cancel: string;
  clear: string;
  connectionError: string;
  backendHint: string;
  suggestedQuestion1: string;
  suggestedQuestion2: string;
  suggestedQuestion3: string;
  suggestedQuestion4: string;
  askPhilosopher: string; // e.g. "Ask Nietzsche..."

  // Settings screen
  settings: string;
  apiKeySection: string;
  apiKeyDesc: string;
  saveApiKey: string;
  backendSection: string;
  backendDesc: string;
  backendRunning: string;
  aboutSection: string;
  aboutDesc: string;
  philosophersList: string;
  createdBy: string;
  languageSection: string;
  languageDesc: string;
  changeLanguage: string;

  // Theme
  themeSection: string;
  themeDesc: string;
  darkMode: string;
  lightMode: string;

  // Onboarding
  onboardingTagline: string;
  onboardingDesc: string;
  onboardingFeature1: string;
  onboardingFeature2: string;
  onboardingFeature3: string;
  onboardingBegin: string;

  // Philosopher localized data
  philosophers: {
    nietzsche: { tagline: string; quote: string; topics: string[] };
    kant: { tagline: string; quote: string; topics: string[] };
    tolstoy: { tagline: string; quote: string; topics: string[] };
    socrates: { tagline: string; quote: string; topics: string[] };
    aristotle: { tagline: string; quote: string; topics: string[] };
    descartes: { tagline: string; quote: string; topics: string[] };
  };

  // Welcome messages
  welcomeMessages: Record<string, string>;
}

const az: Translations = {
  chooseLanguage: 'Dil seçin',
  languageSubtitle: 'Tətbiqin dilini seçin',
  continue: 'Davam et',

  appSubtitle: 'Tarihin ən böyük düşünürləri ilə söhbət et',
  choosePhilosopher: 'Filosof seçin',
  beginConversation: 'Söhbətə başla →',

  back: '← Geri',
  newChat: 'Yeni',
  clearChatTitle: 'Söhbəti sil',
  clearChatMessage: 'Yeni söhbət başlamaq istəyirsiniz?',
  cancel: 'Ləğv et',
  clear: 'Sil',
  connectionError: 'Əlaqə xətası',
  backendHint: 'Backend serverinə qoşulmaq mümkün olmadı.\n\nBackend-in işlədiyinə əmin olun:\ncd backend && npm start',
  suggestedQuestion1: 'Həyatın mənası nədir?',
  suggestedQuestion2: 'Yaxşı həyat necə yaşamalı?',
  suggestedQuestion3: 'Həqiqət nədir?',
  suggestedQuestion4: 'Ən böyük fikirləriniz nədir?',
  askPhilosopher: 'Soruşun...',

  settings: 'Ayarlar',
  apiKeySection: '🔑 Anthropic API Açarı',
  apiKeyDesc: 'API açarınız lokal backend serverinə göndərilir. console.anthropic.com saytından əldə edin.',
  saveApiKey: 'API Açarını Saxla',
  backendSection: '🖥️ Backend Quraşdırması',
  backendDesc: 'Tətbiq lokal backend serverini tələb edir. Terminalda bu əmrləri yerinə yetirin:',
  backendRunning: 'Backend http://localhost:3001 ünvanında işləyir',
  aboutSection: 'ℹ️ Haqqında',
  aboutDesc: 'PhilosopherChat tətbiqi tarixi filosofları simulyasiya etmək üçün adaptiv düşünmə ilə işləyir. Hər filosofun özünəməxsus unikal üslubu var.',
  philosophersList: 'Filosoflar: Nietzsche · Kant · Tolstoy · Sokrat · Aristotel · Dekart',
  createdBy: 'Elgar Zeynalov tərəfindən yaradılıb',
  languageSection: '🌐 Dil',
  languageDesc: 'İnterfeys dilini seçin',
  changeLanguage: 'Dili dəyiş',

  themeSection: '🎨 Görünüş',
  themeDesc: 'Tünd və ya açıq rejim seçin',
  darkMode: 'Tünd Rejim',
  lightMode: 'Açıq Rejim',

  onboardingTagline: 'Tarihin ən böyük\nzəkalarına sual ver',
  onboardingDesc: 'Nitsşe, Kant, Sokrat, Aristotel\nvə digər filosoflarla söhbət et',
  onboardingFeature1: '6 Məşhur Filosof',
  onboardingFeature2: '4 Dil Dəstəyi',
  onboardingFeature3: 'Real Vaxt Söhbət',
  onboardingBegin: 'Başlayaq →',

  philosophers: {
    nietzsche: {
      tagline: 'Xeyir və Şərin Ötəsində',
      quote: 'Allah öldü. Allah ölü qalır. Biz onu öldürdük.',
      topics: ['Güc İradəsi', 'Üstün İnsan', 'Əbədi Qayıdış', 'Nihilizm'],
    },
    kant: {
      tagline: 'Xalis Ağlın Tənqidi',
      quote: 'Yalnız o maksimaya uyğun hərəkət et ki, onu eyni zamanda universal qanun kimi istəyə biləsən.',
      topics: ['Kateqorik İmperativ', 'Xalis Ağıl', 'Borc Etikası', 'Metafizika'],
    },
    tolstoy: {
      tagline: 'Həqiqət. Sevgi. Zorakılıqsızlıq.',
      quote: 'Hər kəs dünyanı dəyişdirməyi düşünür, amma heç kim özünü dəyişdirməyi düşünmür.',
      topics: ['Xristian Anarxizmi', 'Zorakılıqsızlıq', 'Sadə Həyat', 'Əxlaqi Həqiqət'],
    },
    socrates: {
      tagline: 'Mən Bilirəm ki, Heç Nə Bilmirəm',
      quote: 'Araşdırılmamış həyat yaşamağa dəyməz.',
      topics: ['Sokrat Metodu', 'Fəzilət', 'Ədalət', 'Xoşbəxt Həyat'],
    },
    aristotle: {
      tagline: 'Qızıl Orta',
      quote: 'Biz dəfələrlə etdiklərimizik. Mükəmməllik əməl deyil, vərdişdir.',
      topics: ['Eudaimonia', 'Fəzilət Etikası', 'Məntiq', 'Təbiət Fəlsəfəsi'],
    },
    descartes: {
      tagline: 'Düşünürəm, Deməli Mövcudam',
      quote: 'Düşünürəm, deməli mövcudam.',
      topics: ['Metodoloji Şübhə', 'Ruh-Bədən Dualizmi', 'Rasionalizm', 'Riyaziyyat'],
    },
  },

  welcomeMessages: {
    nietzsche: 'Salam. Mənimlə üz-üzə durmağa cəsarət edirsiniz? Yaxşı. Zəiflər Nitsşe ilə söhbət axtarmır — yalnız güclülər, ya da güclü olmaq istəyənlər. Nə istəsəniz soruşun, amma rahat illüziyalarınızı sarsıda biləcək həqiqətlərə hazır olun.',
    kant: 'Günün xeyir. Sizi bu ağıl mübadiləsini qəbul edirəm. Hər həqiqi fəlsəfi araşdırmanın ciddilik və xoş niyyətlə aparılması lazım olduğunu qeyd etmək istəyirəm. Ağıl, etika ya metafizika ilə bağlı hansı sual sizi mənim məsləhətimi almağa gətirib?',
    tolstoy: 'Xoş gəldiniz, dost. Söhbətə gəldiyinizə sevindim. Sadə, səmimi söhbətin həyatdakı ən vacib şeylərdən biri olduğuna inanıram — cəmiyyətin bütün incəliklərindən daha dəyərli. Ürəyinizdə nə var?',
    socrates: 'Ah, xoş gəldiniz! Dərhal etiraf etməliyəm ki, heç nə bilmirəm — ya da demək olar ki, heç nə. Amma bəlkə də tam ona görə söhbət bu qədər dəyərlidir: fikirlərimizi birlikdə araşdırıb möhkəm olub olmadığını görə bilərik. Deyin, hansı sual bu qoca adamla danışmağa gətirib sizi?',
    aristotle: 'Xoş gəldiniz. Sizinlə söhbət etməkdən məmnunam. Söhbətimizin məqsədi, bütün şeylərdə olduğu kimi, bir xeyirə yönəlməlidir. Maraqlıyam — təbiət, etika, siyasət ya bilik haqqında hansı sualları araşdırmaq istəyirsiniz?',
    descartes: 'Günün xeyir. İnanıram ki, edə biləcəyimiz ən vacib şey inanclarımızı diqqətlə araşdırmaqdır — ağlımıza aydın və dəqiq olmayan heç nəyi həqiqət kimi qəbul etməmək. Birlikdə düşünməyə gəldiyinizə sevindim. Nəyi araşdıraq?',
  },
};

const ru: Translations = {
  chooseLanguage: 'Выберите язык',
  languageSubtitle: 'Выберите язык приложения',
  continue: 'Продолжить',

  appSubtitle: 'Беседуйте с величайшими мыслителями истории',
  choosePhilosopher: 'Выберите философа',
  beginConversation: 'Начать разговор →',

  back: '← Назад',
  newChat: 'Новый',
  clearChatTitle: 'Очистить чат',
  clearChatMessage: 'Начать новый разговор?',
  cancel: 'Отмена',
  clear: 'Очистить',
  connectionError: 'Ошибка соединения',
  backendHint: 'Не удалось подключиться к серверу.\n\nУбедитесь, что сервер запущен:\ncd backend && npm start',
  suggestedQuestion1: 'В чём смысл жизни?',
  suggestedQuestion2: 'Как жить хорошей жизнью?',
  suggestedQuestion3: 'Что такое истина?',
  suggestedQuestion4: 'Какова ваша главная идея?',
  askPhilosopher: 'Спросите...',

  settings: 'Настройки',
  apiKeySection: '🔑 API-ключ Anthropic',
  apiKeyDesc: 'Ваш API-ключ отправляется на локальный сервер. Получите его на console.anthropic.com',
  saveApiKey: 'Сохранить API-ключ',
  backendSection: '🖥️ Настройка сервера',
  backendDesc: 'Приложение требует локальный сервер. Выполните эти команды в терминале:',
  backendRunning: 'Сервер работает на http://localhost:3001',
  aboutSection: 'ℹ️ О приложении',
  aboutDesc: 'PhilosopherChat симулирует исторических философов с помощью адаптивного мышления. Каждый философ имеет уникальный стиль и голос.',
  philosophersList: 'Философы: Ницше · Кант · Толстой · Сократ · Аристотель · Декарт',
  createdBy: 'Создано Эльгаром Зейналовым',
  languageSection: '🌐 Язык',
  languageDesc: 'Выберите язык интерфейса',
  changeLanguage: 'Изменить язык',

  themeSection: '🎨 Оформление',
  themeDesc: 'Тёмная или светлая тема',
  darkMode: 'Тёмная тема',
  lightMode: 'Светлая тема',

  onboardingTagline: 'Задавай вопросы\nвеличайшим умам истории',
  onboardingDesc: 'Беседуй с Ницше, Кантом, Сократом,\nАристотелем и другими философами',
  onboardingFeature1: '6 Великих Философов',
  onboardingFeature2: '4 Языка',
  onboardingFeature3: 'Живой Диалог',
  onboardingBegin: 'Начать →',

  philosophers: {
    nietzsche: {
      tagline: 'По ту сторону добра и зла',
      quote: 'Бог мёртв. Бог остаётся мёртвым. И мы его убили.',
      topics: ['Воля к власти', 'Сверхчеловек', 'Вечное возвращение', 'Нигилизм'],
    },
    kant: {
      tagline: 'Критика чистого разума',
      quote: 'Поступай только согласно той максиме, которую ты можешь возвести во всеобщий закон.',
      topics: ['Категорический императив', 'Чистый разум', 'Этика долга', 'Метафизика'],
    },
    tolstoy: {
      tagline: 'Истина. Любовь. Ненасилие.',
      quote: 'Каждый думает о том, чтобы изменить мир, но никто не думает о том, чтобы изменить себя.',
      topics: ['Христианский анархизм', 'Ненасилие', 'Простая жизнь', 'Нравственная правда'],
    },
    socrates: {
      tagline: 'Я знаю, что ничего не знаю',
      quote: 'Непроверенная жизнь не стоит того, чтобы быть прожитой.',
      topics: ['Метод Сократа', 'Добродетель', 'Справедливость', 'Благая жизнь'],
    },
    aristotle: {
      tagline: 'Золотая середина',
      quote: 'Мы есть то, что мы делаем постоянно. Совершенство — не поступок, а привычка.',
      topics: ['Эвдемония', 'Этика добродетели', 'Логика', 'Натурфилософия'],
    },
    descartes: {
      tagline: 'Cogito, Ergo Sum',
      quote: 'Я мыслю, следовательно, я существую.',
      topics: ['Методическое сомнение', 'Дуализм разума и тела', 'Рационализм', 'Математика'],
    },
  },

  welcomeMessages: {
    nietzsche: 'Приветствую. Вы осмеливаетесь встретиться со мной лицом к лицу? Хорошо. Слабые не ищут беседы с Ницше — только сильные, или те, кто желает стать таковыми. Спрашивайте что угодно, но будьте готовы к истинам, которые могут разрушить ваши удобные иллюзии.',
    kant: 'Добрый день. Я приветствую вас в этом обмене разумом. Позвольте заметить, что любое подлинное философское исследование должно вестись со строгостью и добросовестностью. Какой вопрос разума, этики или метафизики привёл вас ко мне?',
    tolstoy: 'Добро пожаловать, друг. Рад, что вы пришли поговорить. Я верю, что простая, искренняя беседа — одна из самых важных вещей в жизни, ценнее всех светских изысков. Что у вас на сердце?',
    socrates: 'Ах, добро пожаловать! Должен сразу признаться, что я ничего не знаю — или почти ничего. Но быть может, именно поэтому беседа так ценна: мы можем вместе исследовать наши идеи и посмотреть, выдержат ли они проверку. Скажите, какой вопрос привёл вас поговорить со старым человеком?',
    aristotle: 'Добро пожаловать. Рад вступить с вами в беседу. Цель нашего разговора, как и всего в мире, должна быть направлена к некоему благу. Мне интересно — какие вопросы природы, этики, политики или знания вы хотите исследовать?',
    descartes: 'Добрый день. Я убеждён, что важнейшее, что мы можем сделать — это тщательно исследовать наши убеждения, не принимая ничего за истину, если оно не ясно и отчётливо нашему разуму. Рад, что вы пришли думать вместе. Что будем исследовать?',
  },
};

const tr: Translations = {
  chooseLanguage: 'Dil seçin',
  languageSubtitle: 'Uygulama dilini seçin',
  continue: 'Devam et',

  appSubtitle: 'Tarihin en büyük düşünürleriyle sohbet edin',
  choosePhilosopher: 'Filozofunuzu seçin',
  beginConversation: 'Sohbete başla →',

  back: '← Geri',
  newChat: 'Yeni',
  clearChatTitle: 'Sohbeti sil',
  clearChatMessage: 'Yeni bir sohbet başlatmak istiyor musunuz?',
  cancel: 'İptal',
  clear: 'Sil',
  connectionError: 'Bağlantı hatası',
  backendHint: 'Sunucuya bağlanılamadı.\n\nSunucunun çalıştığından emin olun:\ncd backend && npm start',
  suggestedQuestion1: 'Hayatın anlamı nedir?',
  suggestedQuestion2: 'İyi bir hayat nasıl yaşanır?',
  suggestedQuestion3: 'Gerçek nedir?',
  suggestedQuestion4: 'En büyük fikriniz nedir?',
  askPhilosopher: 'Sorun...',

  settings: 'Ayarlar',
  apiKeySection: '🔑 Anthropic API Anahtarı',
  apiKeyDesc: 'API anahtarınız yerel sunucuya gönderilir. console.anthropic.com adresinden edinin.',
  saveApiKey: 'API Anahtarını Kaydet',
  backendSection: '🖥️ Sunucu Kurulumu',
  backendDesc: 'Uygulama yerel bir sunucu gerektirir. Terminalde şu komutları çalıştırın:',
  backendRunning: 'Sunucu http://localhost:3001 adresinde çalışıyor',
  aboutSection: 'ℹ️ Hakkında',
  aboutDesc: 'PhilosopherChat, tarihi filozofları uyarlamalı düşünme ile simüle eder. Her filozofun kendine özgü benzersiz bir üslubu vardır.',
  philosophersList: 'Filozoflar: Nietzsche · Kant · Tolstoy · Sokrates · Aristoteles · Descartes',
  createdBy: "Elgar Zeynalov tarafından oluşturuldu",
  languageSection: '🌐 Dil',
  languageDesc: 'Arayüz dilini seçin',
  changeLanguage: 'Dili değiştir',

  themeSection: '🎨 Görünüm',
  themeDesc: 'Koyu veya açık tema seçin',
  darkMode: 'Koyu Tema',
  lightMode: 'Açık Tema',

  onboardingTagline: 'Tarihin en büyük\nzekalarına sorular sor',
  onboardingDesc: 'Nietzsche, Kant, Sokrates, Aristoteles\nve diğer filozoflarla sohbet et',
  onboardingFeature1: '6 Büyük Filozof',
  onboardingFeature2: '4 Dil Desteği',
  onboardingFeature3: 'Gerçek Zamanlı Sohbet',
  onboardingBegin: 'Başlayalım →',

  philosophers: {
    nietzsche: {
      tagline: 'İyinin ve Kötünün Ötesinde',
      quote: 'Tanrı öldü. Tanrı ölü kalmaya devam ediyor. Ve biz onu öldürdük.',
      topics: ['Güç İstenci', 'Üstinsan', 'Ebedi Dönüş', 'Nihilizm'],
    },
    kant: {
      tagline: 'Salt Aklın Eleştirisi',
      quote: 'Yalnızca, aynı zamanda evrensel yasa olmasını isteyebileceğin ilkeye göre davran.',
      topics: ['Kategorik Buyruk', 'Salt Akıl', 'Ödev Etiği', 'Metafizik'],
    },
    tolstoy: {
      tagline: 'Hakikat. Sevgi. Şiddetsizlik.',
      quote: "Herkes dünyayı değiştirmeyi düşünür, ama kimse kendini değiştirmeyi düşünmez.",
      topics: ['Hristiyan Anarşizmi', 'Şiddetsizlik', 'Sade Hayat', 'Ahlaki Hakikat'],
    },
    socrates: {
      tagline: 'Hiçbir Şey Bilmediğimi Biliyorum',
      quote: 'Sorgulanmamış bir hayat yaşamaya değmez.',
      topics: ['Sokrates Yöntemi', 'Erdem', 'Adalet', 'İyi Hayat'],
    },
    aristotle: {
      tagline: 'Altın Orta',
      quote: 'Biz sürekli yaptığımız şeyleriz. Mükemmellik bir eylem değil, alışkanlıktır.',
      topics: ['Eudaimonia', 'Erdem Etiği', 'Mantık', 'Doğa Felsefesi'],
    },
    descartes: {
      tagline: 'Düşünüyorum, Öyleyse Varım',
      quote: 'Düşünüyorum, öyleyse varım.',
      topics: ['Metodik Şüphe', 'Zihin-Beden İkilemi', 'Rasyonalizm', 'Matematik'],
    },
  },

  welcomeMessages: {
    nietzsche: 'Merhaba. Benimle yüz yüze gelme cesaretini buldunuz? İyi. Zayıflar Nietzsche ile sohbet aramaz — yalnızca güçlüler, ya da güçlü olmak isteyenler. Ne isterseniz sorun, ama rahat yanılsamalarınızı parçalayabilecek gerçeklere hazır olun.',
    kant: 'İyi günler. Sizi bu akıl alışverişine kabul ediyorum. Her gerçek felsefi soruşturmanın titizlik ve iyi niyetle yürütülmesi gerektiğini belirtmek isterim. Akıl, etik ya da metafizikle ilgili hangi soru sizi benim öğütlerime başvurmaya yöneltti?',
    tolstoy: 'Hoş geldiniz, dostum. Konuşmaya geldiğinize sevindim. Basit, samimi sohbetin hayattaki en önemli şeylerden biri olduğuna inanıyorum — toplumun tüm zarifliğinden daha değerli. Yüreğinizde ne var?',
    socrates: 'Ah, hoş geldiniz! Hemen itiraf etmeliyim ki hiçbir şey bilmiyorum — ya da neredeyse hiçbir şey. Ama belki de tam bu yüzden sohbet bu kadar değerlidir: fikirlerimizi birlikte inceleyip tutarlı olup olmadığını görebiliriz. Söyleyin, hangi soru sizi bugün yaşlı bir adamla konuşmaya yöneltti?',
    aristotle: 'Hoş geldiniz. Sizinle söylev değiştirmekten memnuniyet duyarım. Konuşmamızın amacı, her şeyde olduğu gibi, bir iyiye yönelmelidir. Merak ediyorum — doğa, etik, siyaset ya da bilgi hakkında hangi soruları keşfetmek istiyorsunuz?',
    descartes: 'İyi günler. Yapabileceğimiz en önemli şeyin inançlarımızı dikkatlice incelemek olduğunu düşünüyorum — aklımıza açık ve seçik görünmeyen hiçbir şeyi doğru olarak kabul etmemek. Birlikte düşünmeye geldiğinize sevindim. Ne inceleyeceğiz?',
  },
};

const en: Translations = {
  chooseLanguage: 'Choose Language',
  languageSubtitle: 'Select the app language',
  continue: 'Continue',

  appSubtitle: "Converse with history's greatest minds",
  choosePhilosopher: 'Choose your philosopher',
  beginConversation: 'Begin Conversation →',

  back: '← Back',
  newChat: 'New',
  clearChatTitle: 'Clear Chat',
  clearChatMessage: 'Start a new conversation?',
  cancel: 'Cancel',
  clear: 'Clear',
  connectionError: 'Connection Error',
  backendHint: 'Could not reach the backend server.\n\nMake sure the backend is running:\ncd backend && npm start',
  suggestedQuestion1: 'What is the meaning of life?',
  suggestedQuestion2: 'How should I live a good life?',
  suggestedQuestion3: 'What is truth?',
  suggestedQuestion4: 'What is your greatest idea?',
  askPhilosopher: 'Ask...',

  settings: 'Settings',
  apiKeySection: '🔑 Anthropic API Key',
  apiKeyDesc: 'Your API key is sent to the local backend server. Get yours at console.anthropic.com',
  saveApiKey: 'Save API Key',
  backendSection: '🖥️ Backend Setup',
  backendDesc: 'This app requires a local backend server. Run these commands in your terminal:',
  backendRunning: 'The backend runs on http://localhost:3001',
  aboutSection: 'ℹ️ About',
  aboutDesc: 'PhilosopherChat simulates historical philosophers using adaptive thinking. Each philosopher has a unique and authentic voice and style.',
  philosophersList: 'Philosophers: Nietzsche · Kant · Tolstoy · Socrates · Aristotle · Descartes',
  createdBy: 'Created by Elgar Zeynalov',
  languageSection: '🌐 Language',
  languageDesc: 'Select the interface language',
  changeLanguage: 'Change Language',

  themeSection: '🎨 Appearance',
  themeDesc: 'Choose dark or light theme',
  darkMode: 'Dark Mode',
  lightMode: 'Light Mode',

  onboardingTagline: "Ask questions to\nhistory's greatest minds",
  onboardingDesc: 'Chat with Nietzsche, Kant, Socrates,\nAristotle and other great philosophers',
  onboardingFeature1: '6 Great Philosophers',
  onboardingFeature2: '4 Languages',
  onboardingFeature3: 'Real-Time Dialogue',
  onboardingBegin: 'Get Started →',

  philosophers: {
    nietzsche: {
      tagline: 'Beyond Good and Evil',
      quote: 'God is dead. God remains dead. And we have killed him.',
      topics: ['Will to Power', 'Übermensch', 'Eternal Recurrence', 'Nihilism'],
    },
    kant: {
      tagline: 'Critique of Pure Reason',
      quote: 'Act only according to that maxim by which you can at the same time will it to be universal law.',
      topics: ['Categorical Imperative', 'Pure Reason', 'Duty Ethics', 'Metaphysics'],
    },
    tolstoy: {
      tagline: 'Truth. Love. Nonviolence.',
      quote: 'Everyone thinks of changing the world, but no one thinks of changing himself.',
      topics: ['Christian Anarchism', 'Nonviolence', 'Simple Life', 'Moral Truth'],
    },
    socrates: {
      tagline: 'I Know That I Know Nothing',
      quote: 'The unexamined life is not worth living.',
      topics: ['Socratic Method', 'Virtue', 'Justice', 'The Good Life'],
    },
    aristotle: {
      tagline: 'The Golden Mean',
      quote: 'We are what we repeatedly do. Excellence, then, is not an act but a habit.',
      topics: ['Eudaimonia', 'Virtue Ethics', 'Logic', 'Natural Philosophy'],
    },
    descartes: {
      tagline: 'Cogito, Ergo Sum',
      quote: 'I think, therefore I am.',
      topics: ['Methodical Doubt', 'Mind-Body Dualism', 'Rationalism', 'Mathematics'],
    },
  },

  welcomeMessages: {
    nietzsche: `Greetings. You dare to face me? Good. The weak do not seek conversation with Nietzsche — only the strong, or those who wish to become so. Ask me what you will, but be prepared for truths that may shatter your comfortable illusions.`,
    kant: `Good day. I welcome you to this exchange of reason. Permit me to note that any genuine philosophical inquiry must be conducted with rigor and good faith. What question of reason, ethics, or metaphysics brings you to seek my counsel?`,
    tolstoy: `Welcome, friend. I am glad you have come to talk. I believe that simple, sincere conversation is one of the most important things in life. What is on your heart?`,
    socrates: `Ah, welcome! I must confess at once that I know nothing — or nearly nothing. But perhaps that is precisely why conversation is so valuable: we may examine our ideas together. Tell me, what question brings you to speak with an old man today?`,
    aristotle: `Welcome. I am pleased to engage in discourse with you. The purpose of our conversation should be directed toward some good. I am curious — what questions of nature, ethics, politics, or knowledge do you wish to explore?`,
    descartes: `Good day. I find that the most important thing we can do is examine our beliefs carefully. I am glad you have come to think together. What shall we examine?`,
  },
};

export const TRANSLATIONS: Record<Language, Translations> = { az, ru, tr, en };
