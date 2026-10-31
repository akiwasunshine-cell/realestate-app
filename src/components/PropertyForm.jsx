import { useId, useState } from 'react'

// 物件の新規登録・編集で共通のフォーム
export default function PropertyForm({ initialValues, title, submitLabel, onSubmit, onCancel }) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [rent, setRent] = useState(initialValues?.rent ?? '')
  const [area, setArea] = useState(initialValues?.area ?? '')
  const [layout, setLayout] = useState(initialValues?.layout ?? '')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  // 同じ画面に複数のフォームを開いてもラベルの紐付けが重複しないようにする
  const formId = useId()

  async function handleSubmit(event) {
    event.preventDefault()

    const values = {
      name: name.trim(),
      rent: Number(rent),
      area: area.trim(),
      layout: layout.trim(),
    }

    // required では空白のみの入力を弾けないため、ここで確認する
    if (!values.name || !values.area || !values.layout) {
      setErrorMessage('すべての項目を入力してください。')
      return
    }

    setErrorMessage('')
    setSubmitting(true)
    try {
      // 成功時は親コンポーネントがこのフォームを閉じる
      await onSubmit(values)
    } catch (error) {
      console.error(error)
      setErrorMessage('保存に失敗しました。もう一度お試しください。')
      setSubmitting(false)
    }
  }

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <h2>{title}</h2>

      <label htmlFor={`${formId}-name`}>物件名</label>
      <input
        id={`${formId}-name`}
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />

      <label htmlFor={`${formId}-rent`}>家賃（円）</label>
      <input
        id={`${formId}-rent`}
        type="number"
        min="0"
        max="2147483647"
        step="1"
        value={rent}
        onChange={(event) => setRent(event.target.value)}
        required
      />

      <label htmlFor={`${formId}-area`}>エリア名</label>
      <input
        id={`${formId}-area`}
        value={area}
        onChange={(event) => setArea(event.target.value)}
        required
      />

      <label htmlFor={`${formId}-layout`}>間取り</label>
      <input
        id={`${formId}-layout`}
        placeholder="例：1LDK"
        value={layout}
        onChange={(event) => setLayout(event.target.value)}
        required
      />

      {errorMessage && <p className="message error" role="alert">{errorMessage}</p>}

      <div className="form-actions">
        <button type="submit" className="primary-button" disabled={submitting}>
          {submitting ? '保存中...' : submitLabel}
        </button>
        <button type="button" className="secondary-button" onClick={onCancel} disabled={submitting}>
          キャンセル
        </button>
      </div>
    </form>
  )
}
