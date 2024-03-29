import './../assets/styles/btnFloat.css'

const BtnFloat = ({ onClickShowTable }: { onClickShowTable: () => void }) => {

  return (
    <button
      className="btn-float"
      onClick={onClickShowTable}
    >
      <img
        src="/message.svg"
        width={60}
        height={60} />
    </button>
  )
}

export default BtnFloat
