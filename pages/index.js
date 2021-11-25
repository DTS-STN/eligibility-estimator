export default function Index() {
  return (
    <div className="container mx-auto flex flex-col mt-8 font-gc space-y-4">
      <div className="grid tablet:grid-cols-1 mobile:grid-cols-2 gap-4">
        <div className="rounded border-[1px] border-solid border-default-text px-6 py-4 space-y-4">
          <p className="h5">Inputs</p>
          <input type="text" placeholder="name" className="form-control" />
          <input type="number" placeholder="5" className="form-control" />
          <input
            type="email"
            placeholder="my@email.com"
            className="form-control"
          />
          <input type="password" placeholder="****" className="form-control" />
          <select className="form-control" placeholder="Select from ...">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="2">3</option>
            <option value="2">4</option>
            <option value="2">5</option>
          </select>
          <p className="italic">Searchable Select? Mockup required</p>
        </div>
        <div className="rounded border-[1px] border-solid border-default-text px-6 py-4">
          <p className="h5">Typography</p>
          <p className="h1">Size H1</p>
          <p className="h2">Size H2</p>
          <p className="lead">Size Lead</p>
          <p className="h3">Size H3</p>
          <p className="h4">Size H4</p>
          <p className="h5">Size H5</p>
          <p className="">(Default Size)</p>
          <p className="h6">Size H6</p>
          <p className="small">Size small</p>
        </div>
      </div>
      <div className="rounded border-[1px] border-solid border-default-text px-6 py-4 space-x-4">
        <p className="h5">Buttons</p>
        <button className="btn btn-default">Default</button>
        <button className="btn btn-primary">Primary</button>
        <button className="btn btn-success">Success</button>
        <button className="btn btn-info">Info</button>
        <button className="btn btn-warning">Warning</button>
        <button className="btn btn-danger">Danger</button>
        <button className="btn btn-link">Link</button>
      </div>
    </div>
  )
}
