import { StrictMode } from 'react'
import ReactDom from 'react-dom/client'
import './components/styles/index.css'
import App from './components/App.jsx'
import './components/styles/Main.css'; 
import './components/styles/flashcard.css'
import store from './components/redux/store.jsx'
import { Provider } from 'react-redux'
const root = ReactDom.createRoot(document.getElementById('root'));
root.render(
  <Provider store ={store}>
    <App/>
  </Provider>
)
