import React, { useState, useContext } from "react";
import { useQuery } from "react-query";
import { ContextoFormulario } from "../../context/ContextoFormulario";

// Debemos reemplazar este array por los datos provenientes de la API.
/* const especies = [
  { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon-species/1/" },
  { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon-species/2/" },
  { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon-species/3/" },
]; */

const getEspecies = async (num) => {
  const resp = await fetch(`https://pokeapi.co/api/v2/pokemon-species/?offset=${num}&limit=20`)
  const data = await resp.json()
  return data.results
}

const InputEspecie = ({ name, label }) => {
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const { handleInputBlur } = useContext(ContextoFormulario);
  const [number, setNumber] = useState(0)
  const { data: especies } = useQuery(['especies', number], () => getEspecies(number), {
    keepPreviousData: true
  })

  const elegirEspecie = (e, nombreEspecie) => {
    e.preventDefault();

    handleInputBlur("ACTUALIZAR_POKEMON", {
      campo: "especiePokemon",
      valor: nombreEspecie,
    });
    setMostrarPopup(false);
  };

  const renderizarEspecies = () => (
    <>
      {especies.map((especie) => (
        <button
          key={especie.name}
          className="botones-especie"
          onClick={(e) => elegirEspecie(e, especie.name)}
        >
          {especie.name}
        </button>
      ))}
    </>
  );

  return (
    <div className="input-contenedor">
      {mostrarPopup && (
        <div className="popup-especie">
          <h4>Seleccionar especie</h4>
          <div className="contenedor-especies">{renderizarEspecies()}</div>
          <div className="paginador">
            <button className="boton-anterior" onClick={() => setNumber(Math.max(0, number - 20))}>Anterior</button>
            <button className="boton-siguiente" onClick={() => setNumber(number + 20)}>Siguiente</button>
          </div>
        </div>
      )}
      <p htmlFor={name}>{label}</p>
      <button
        className="boton-seleccionar-especies"
        onClick={() => setMostrarPopup(true)}
      >
        Seleccionar
      </button>
    </div>
  );
};

export default InputEspecie;
