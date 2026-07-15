import { useState, useEffect } from 'react'
import { settingsApi } from '../services/api'
import fallbackLogo from '../assets/img/logo.png'

export function useLogo() {
  const [logoUrl, setLogoUrl] = useState(fallbackLogo)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    settingsApi.get('logo_url')
      .then((url) => {
        if (url) {
          setLogoUrl(url)
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  return { logoUrl, loaded }
}
