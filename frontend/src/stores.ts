import { writable } from "svelte/store";
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { RadioBrowserApi } from 'radio-browser-api';

const firebaseConfig = {
  apiKey: "AIzaSyAcAIY3_4LgjSYUue41lu_FT2BtWz9YFjg",
  authDomain: "web-radio-fefff.firebaseapp.com",
  projectId: "web-radio-fefff",
  storageBucket: "web-radio-fefff.appspot.com",
  messagingSenderId: "99402245683",
  appId: "1:99402245683:web:121dfa721d331d2c31e546",
  measurementId: "G-W8F7L90Y2S"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const user_data = writable({
  uid: '',
  favorites: []
});
export const backend_uri = writable('http://localhost:3333');
export const radios = writable({
  top_votes: [],
  top_clicks: [],
  recent_clicks: [],
  searchs: []
});

export const open_audio_control = writable(false);
export const open_mini_audio_control = writable(false);
export const current_station = writable({
  bitrate: 0,
  codec: '',
  country: '',
  country_codes: '',
  favicon: '',
  home_page: '',
  name: '',
  state: '',
  station_id: '',
  tags: '',
  url_resolved: '',
  paused: true,
  favorite: false,
  votes: 0
});
export const audio = writable(null);
export const api = new RadioBrowserApi('My Web Radio')
