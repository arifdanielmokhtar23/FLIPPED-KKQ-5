
import { SectionId, Tarannum, TextModule, RelatedLink, HomeworkLink, NavItem } from './types'; // Added NavItem to imports

export const NAV_ITEMS: NavItem[] = [ // Updated to use NavItem type
  { id: 'home', label: 'HALAMAN UTAMA', icon: 'fas fa-home', ariaLabelOverride:"halaman ouw ta ma" },
  { id: 'modul-teks', label: 'MODUL TEKS', icon: 'fas fa-book', ariaLabelOverride: " module text" },
  { id: 'home', label: 'MODUL AUDITORI', icon: 'fas fa-music', ariaLabelOverride: "module auditory" }, // Special case, links to home but conceptually auditori
  { id: 'game', label: 'TUGASAN', icon: 'fas fa-clipboard-list' },
  { id: 'hantar-rakaman', label: 'HANTAR RAKAMAN', icon: 'fas fa-microphone', ariaLabelOverride: "hunt tar racow man" },
  { id: 'tyson-assistant', label: 'TYSON ASSISTANT', icon: 'fas fa-robot' },
];

export const AUDITORI_MODULES: Tarannum[] = [
  { id: 'bayyati', name: 'Bayyati', description: 'Selami alunan Bayyati', iconClass: 'fas fa-dove', bgColor: 'bg-purple-100', textColor: 'text-purple-600', targetSection: 'bayyati-content' },
  { id: 'hijaz', name: 'Hijaz', description: 'Terokai melodi Hijaz', iconClass: 'fas fa-mountain', bgColor: 'bg-blue-100', textColor: 'text-blue-600', targetSection: 'hijaz-content' },
  { id: 'nahawand', name: 'Nahawand', description: 'Pelajari alunan Nahawand', iconClass: 'fas fa-tree', bgColor: 'bg-green-100', textColor: 'text-green-600', targetSection: 'nahawand-content' },
];

export const TEKS_MODULES: TextModule[] = [
  { 
    id: 'tajwid', 
    title: 'Pengenalan Ilmu Tajwid', 
    description: 'Mempelajari asas-asas ilmu tajwid...', 
    link: '#',
    content: `Ilmu Tajwid adalah ilmu tentang cara membaca Al-Quran dengan betul dan tartil. Ia merangkumi pelbagai aspek penting seperti sebutan huruf (makhraj huruf), sifat-sifat huruf, hukum nun mati dan tanwin, hukum mim mati, hukum mad (panjang pendek bacaan), serta waqaf dan ibtida’ (tempat berhenti dan memulakan bacaan). Tujuan utama mempelajari ilmu tajwid adalah untuk memelihara keaslian bacaan Al-Quran sebagaimana yang telah diajarkan oleh Rasulullah SAW melalui Jibril AS. Dengan mengamalkan tajwid, seorang pembaca dapat mengelakkan kesalahan-kesalahan yang boleh mengubah makna ayat Al-Quran. Terdapat pelbagai hukum dalam tajwid, contohnya Idgham, Ikhfa', Izhar, dan Iqlab untuk nun mati dan tanwin. Setiap Muslim digalakkan untuk mempelajari dan mempraktikkan ilmu tajwid dalam bacaan Al-Quran sehari-hari.`
  },
  { 
    id: 'tarannum', 
    title: 'Seni Tarannum Al-Quran', 
    description: 'Kenali 7 jenis tarannum utama...', 
    link: '#',
    content: `Tarannum Al-Quran merujuk kepada seni melagukan bacaan ayat-ayat suci Al-Quran dengan suara yang merdu dan mengikut kaedah-kaedah tertentu. Ia bukan sekadar nyanyian, tetapi satu disiplin ilmu yang bertujuan untuk memperindahkan bacaan Al-Quran serta membantu pendengar menghayati maksud ayat yang dibaca. Terdapat pelbagai jenis tarannum yang masyhur, antaranya ialah Bayyati, Hijaz, Nahawand, Rast, Sikah, Jiharkah, dan Soba. Setiap tarannum ini mempunyai ciri-ciri, sifat alunan, dan kesesuaiannya dengan jenis-jenis ayat Al-Quran. Sebagai contoh, Tarannum Bayyati terkenal dengan alunannya yang lembut dan syahdu, sering digunakan untuk ayat-ayat yang menceritakan rahmat dan kebesaran Allah. Manakala Tarannum Hijaz pula mempunyai alunan yang lebih tegas dan bersemangat, sesuai untuk ayat-ayat perintah atau ayat-ayat yang menggambarkan kekuatan.`
  },
  { 
    id: 'makhraj', 
    title: 'Makhraj Huruf & Sifat Huruf', 
    description: 'Panduan lengkap mengenai tempat keluar huruf...', 
    link: '#',
    content: `Makhraj huruf adalah tempat keluar bunyi huruf-huruf Hijaiyah ketika dilafazkan. Terdapat lima makhraj utama iaitu Al-Jauf (rongga mulut dan kerongkong), Al-Halq (kerongkong), Al-Lisan (lidah), Asy-Syafatain (dua bibir), dan Al-Khaisyum (rongga hidung). Setiap makhraj utama ini mempunyai bahagian-bahagiannya yang lebih terperinci. Memahami makhraj huruf sangat penting dalam ilmu tajwid kerana kesalahan dalam menyebut makhraj boleh mengubah sebutan huruf dan seterusnya mengubah makna ayat. Sifat huruf pula adalah ciri-ciri yang ada pada setiap huruf Hijaiyah. Terdapat sifat-sifat yang berlawanan (seperti Al-Hams lawannya Al-Jahr, Asy-Syiddah lawannya Ar-Rakhawah) dan sifat-sifat tunggal (seperti Al-Qalqalah, As-Safir, Al-Inhiraf). Mengetahui sifat huruf membantu pembaca melafazkan huruf dengan lebih tepat dan fasih, sesuai dengan haknya.`
  },
];

export const INITIAL_RELATED_LINKS_DATA: RelatedLink[] = [
    { id: 'youtube_default', text: 'YouTube Contoh', url: '#', iconClass: 'fab fa-youtube', iconColor: 'text-red-500' },
    { id: 'pdf_default', text: 'Nota PDF', url: '#', iconClass: 'fas fa-file-alt', iconColor: 'text-blue-500' },
    { id: 'external_default', text: 'Laman Rujukan', url: '#', iconClass: 'fas fa-external-link-alt', iconColor: 'text-green-500' },
];

export const INITIAL_HOMEWORK_LINK_1_DATA: HomeworkLink = {
  id: 'homeworkLink1',
  text: 'Pautan Kerja Rumah 1',
  url: '#',
  gradientClass: 'from-purple-500 to-indigo-600',
};

export const INITIAL_HOMEWORK_LINK_2_DATA: HomeworkLink = {
  id: 'homeworkLink2',
  text: 'Pautan Kerja Rumah 2',
  url: '#',
  gradientClass: 'from-pink-500 to-rose-600',
};

export const ADMIN_PASSWORD = 'FLIPPEDKKQADMIN2025';
export const TELEGRAM_BOT_TOKEN = '7770522314:AAGGY02vpxtqxjQgGdHCxteNy4XatS0FhpY';
export const TELEGRAM_CHAT_ID = '1671441217';