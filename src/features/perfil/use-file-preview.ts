import { useEffect, useState } from 'react'

/** Pré-visualização local de um arquivo escolhido (data URL, sem vazar object URLs). */
export function useFilePreview(file?: File) {
  const [url, setUrl] = useState<string>()
  useEffect(() => {
    if (!file) return
    let active = true
    const reader = new FileReader()
    reader.onload = () => {
      if (active && typeof reader.result === 'string') setUrl(reader.result)
    }
    reader.readAsDataURL(file)
    return () => {
      active = false
    }
  }, [file])
  return file ? url : undefined
}
