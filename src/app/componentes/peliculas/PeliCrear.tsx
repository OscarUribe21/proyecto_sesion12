import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import noFoto from "../../../assets/img/noDisponible.png";

import { PeliculaGenero } from "../../modelos/PeliculaGenero";
import { ARREGLO_PELICULA_GENERO } from "../../utilidades/dominios/DomGenero";
import { useFormulario } from "../../utilidades/misHooks/useFormulario";
import { Pelicula } from "../../modelos/Pelicula";
import { useNavigate } from "react-router-dom";
import { ARREGLO_PELICULAS } from "../../mocks/Pelicula-mocks";
import { ConvertirBase64 } from "../../utilidades/funciones/ConvertirBase64";

export const PeliCrear = () => {
  const irsePara = useNavigate();

  type formHtml = React.FormEvent<HTMLFormElement>;
  const [enProceso, setEnProceso] = useState<boolean>(false);
  const [imgBase64, setImgBase64] = useState<any>();
  const [imgMiniatura, setimgMiniatura] = useState<any>(noFoto);

  const [arrPeliculas] = useState<Pelicula[]>(ARREGLO_PELICULAS);
  const [arrGeneros] = useState<PeliculaGenero[]>(ARREGLO_PELICULA_GENERO);

  let {
    nombrePelicula,
    protagonistaPelicula,
    codGeneroPelicula,
    imagenPelicula,
    dobleEnlace,
    objeto,
  } = useFormulario<Pelicula>(new Pelicula(0, "", "", "", "", ""));

  const enviarForm = (objForm: formHtml) => {
    objForm.preventDefault();
    const formulario = objForm.currentTarget;

    if (formulario.checkValidity() === false) {
      objForm.preventDefault();
      objForm.stopPropagation();
      setEnProceso(true);
    } else {
      const ultimaPeli = arrPeliculas[arrPeliculas.length - 1];
      const nuevoCod = ultimaPeli.codPelicula + 1;
      objeto.codPelicula = nuevoCod;
    objeto.imagenPelicula = imagenPelicula.substring(imagenPelicula.lastIndexOf("\\")+1);
      objeto.imagenPeliculaBase64 = imgBase64; 
      arrPeliculas.push(objeto);
      setEnProceso(false);
      irsePara("/plistar");
    }
  };

const cargarImagen = async (e: any) => {
  const archivos = e.target.files;
  const imagen = archivos[0];
  setimgMiniatura(URL.createObjectURL(imagen));
  dobleEnlace(e);
  const base64 = await ConvertirBase64(imagen);
  setImgBase64(base64);
};

  return (
    <div className="d-flex justify-content-center">
      <div className="col-md-5 mt-5 pb-4">
        <Form noValidate validated={enProceso} onSubmit={enviarForm}>
          <div className="card">
            <div className="card-header">
              <h5 className=" rojito">Formulario creación</h5>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <Form.Group controlId="nom">
                  <Form.Label>
                    <span className="rojito">*</span> Nombre película
                  </Form.Label>
                  <Form.Control
                    size="sm"
                    required
                    type="text"
                    name="nombrePelicula"
                    value={nombrePelicula}
                    onChange={dobleEnlace}
                  />
                </Form.Group>
              </div>

              <div className="mb-3">
                <Form.Group controlId="pro">
                  <Form.Label>
                    <span className="rojito">*</span> Protagonista
                  </Form.Label>
                  <Form.Control
                    size="sm"
                    required
                    type="text"
                    name="protagonistaPelicula"
                    value={protagonistaPelicula}
                    onChange={dobleEnlace}
                  />
                </Form.Group>
              </div>

              <div className="mb-3">
                <Form.Group controlId="gen">
                  <Form.Label>
                    <span className="rojito">*</span> Género
                  </Form.Label>

                  <Form.Select
                    size="sm"
                    required
                    name="codGeneroPelicula"
                    value={codGeneroPelicula}
                    onChange={dobleEnlace}
                  >
                    <option value="">Seleccione un genero</option>

                    {arrGeneros.map((miGenero: PeliculaGenero) => (
                      <option
                        value={miGenero.codGenero}
                        key={miGenero.codGenero}
                      >
                        {miGenero.nombreGenero}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="mb-3">
                <Form.Group controlId="fot">
                  <Form.Label>
                    <span className="rojito">*</span> Imágen
                  </Form.Label>
                  <Form.Control
                    size="sm"
                    required
                    type="file"
                    name="imagenPelicula"
                    value = {imagenPelicula}
                    onChange={cargarImagen}
                  />
                </Form.Group>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-center">
                  <img
                    src={imgMiniatura}
                    alt="no foto"
                    className="maximoTamanoCreacion"
                  />
                </div>
              </div>
            </div>

            <div className="card-footer">
              <button type="submit" className="btn btn-primary">
                Crear película
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};
