import React from 'react'
import { render } from 'react-dom'
import { IntlProvider } from 'react-intl'
import Cookie from 'js-cookie'
import App from './App'

const locale = Cookie.get('locale') || 'en'

render(
  <IntlProvider locale={locale}>
    <App />
  </IntlProvider>,
  document.getElementById('app'))
