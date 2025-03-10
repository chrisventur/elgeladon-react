import { useState, useEffect } from "react";
import Modal from "components/Modal/Modal";
import "./AdicionaEditaPaletaModal.css";
import { PaletaService } from "services/PaletaService";
import { ActionMode } from "constants/index";

function AdicionaEditaPaletaModal({
  closeModal,
  onCreatePaleta,
  mode,
  paletaToUpdate,
  onUpdatePaleta,
}) {
  const form = {
    preco: paletaToUpdate?.preco ?? "",
    sabor: paletaToUpdate?.sabor ?? "",
    recheio: paletaToUpdate?.recheio ?? "",
    descricao: paletaToUpdate?.descricao ?? "",
    foto: paletaToUpdate?.foto ?? "",
  };

  const [state, setState] = useState(form);
  const handleChange = (e, name) => {
    setState({
      ...state,
      [name]: e.target.value,
    });
  };

  const [canDisable, setCanDisable] = useState(true);

  const canDisableSendButton = () => {
    const response = !Boolean(
      state.descricao.length &&
        state.foto.length &&
        state.sabor.length &&
        String(state.preco).length
    );

    setCanDisable(response);
  };

  useEffect(() => {
    canDisableSendButton();
  });

  const handleSend = async () => {
    const renomeiaCaminhoFoto = (fotoPath) => fotoPath.split(/\\|\//).pop();

    const { sabor, recheio, descricao, preco, foto } = state;

    const titulo = sabor + (recheio && " com " + recheio);

    const paleta = {
      ...(paletaToUpdate && { _id: paletaToUpdate?.id }),
      sabor: titulo,
      descricao,
      preco,
      foto: `assets/IMG/${renomeiaCaminhoFoto(foto)}`,
    };

    const serviceCall = {
      [ActionMode.NORMAL]: () => PaletaService.create(paleta),
      [ActionMode.ATUALIZAR]: () =>
        PaletaService.updtateById(paletaToUpdate?.id, paleta),
    };

    const response = await serviceCall[mode]();

    const actionResponse = {
      [ActionMode.NORMAL]: () => onCreatePaleta(response),
      [ActionMode.ATUALIZAR]: () => onUpdatePaleta(response),
    };

    actionResponse[mode]();

    const reset = {
      preco: "",
      sabor: "",
      recheio: "",
      descricao: "",
      foto: "",
    };

    setState(reset);
    closeModal();
  };

  return (
    <Modal closeModal={closeModal}>
      <div className="AdicionaPaletaModal">
        <form autoComplete="off">
          <h2>
            {" "}
            {ActionMode.ATUALIZAR === mode ? "Atualizar" : "Adicionar ao"}{" "}
            Cardápio{" "}
          </h2>

          <div>
            <label className="AdicionaPaletaModal__text" htmlFor="preco">
              Preço:{" "}
            </label>
            <input
              id="preco"
              type="text"
              placeholder="R$ 10,00"
              value={state.preco}
              onChange={(e) => handleChange(e, "preco")}
              required
            />
          </div>
          <div>
            <label className="AdicionaPaletaModal__text" htmlFor="sabor">
              Sabor:{" "}
            </label>
            <input
              id="sabor"
              type="text"
              placeholder="Uva"
              value={state.sabor}
              onChange={(e) => handleChange(e, "sabor")}
              required
            />
          </div>
          <div>
            <label className="AdicionaPaletaModal__text" htmlFor="recheio">
              Recheio:{" "}
            </label>
            <input
              id="recheio"
              type="text"
              placeholder="Chocolate"
              value={state.recheio}
              onChange={(e) => handleChange(e, "recheio")}
            />
          </div>
          <div>
            <label className="AdicionaPaletaModal__text" htmlFor="descricao">
              Descrição:{" "}
            </label>
            <input
              id="descricao"
              type="text"
              placeholder="Detalhes do produto"
              value={state.descricao}
              onChange={(e) => handleChange(e, "descricao")}
              required
            />
          </div>
          <div>
            <label
              className="AdicionaPaletaModal__text AdicionaPaletaModal__foto-label"
              htmlFor="foto"
              required
            >
              {!state.foto.length ? "Selecionar Imagem" : state.foto}
            </label>

            <input
              className="AdicionaPaletaModal__foto"
              id="foto"
              type="file"
              accept="image/png, image/gif, image/jpeg"
              onChange={(e) => handleChange(e, "foto")}
              required
            />
          </div>
          <button
            className="AdicionaPaletaModal__enviar"
            type="button"
            disabled={canDisable}
            onClick={handleSend}
          >
            {ActionMode.NORMAL === mode ? "Enviar" : "Atualizar"}
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default AdicionaEditaPaletaModal;
