import { useState } from "react";
import Markdown from "react-markdown";
import ReactModal from "react-modal";
import { Global } from "~/Global";
import type { AocDay } from "~/types";
import { pngBorder } from "~/utils/styling";

// @ts-expect-error Ignore this any
export const EditModal = ({ isOpen, onClose, current, index }) => {
  const { _l, _a1, _a2 } = current
    ? { _l: Global.pLangs.findIndex((pl) => pl.code == current.lang.code), _a1: current.answer1, _a2: current.answer2 }
    : { _l: 0, _a1: 0, _a2: 0 };

  const [selected, setSelected] = useState<number>(_l);
  const [answer1, setAnswer1] = useState<number>(_a1);
  const [answer2, setAnswer2] = useState<number>(_a2);

  console.log(`selected: ${selected}`)
  return (
    <ReactModal isOpen={isOpen} ariaHideApp={false}>
      <div 
        id="modal"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "75%",
        }}
      >
        <h2>Day {index+1}</h2>
        <div id="edit-form">
          <div>
            <label htmlFor="select-lang">Language: </label>
            <select
              name="select-lang"
              id="select-lang"
              onChange={(e) => { setSelected(parseInt(e.target.value)) }}
              value={selected}
            >
              {Global.pLangs.map((pl, i) =>
                <option key={i} value={i}>{pl.name}</option>
              )}
            </select>
            <button onClick={() => setSelected(Math.floor(Math.random() * Global.pLangs.length))}>Randomize</button>
          </div>
          <div>
            <label htmlFor="input-answer1">Answer 1: </label>
            <input type="number" value={answer1} onChange={(e) => setAnswer1(parseInt(e.target.value))}></input>
          </div>
          <div>
            <label htmlFor="input-answer2">Answer 2: </label>
            <input type="number" value={answer2} onChange={(e) => setAnswer2(parseInt(e.target.value))}></input>
          </div>
          <div id="modal-buttons" style={{display: "flex", justifyContent: "center"}}>
            <button onClick={() => onClose({ lang: Global.pLangs[selected], answer1, answer2 } as AocDay)}>Confirm</button>
            <button onClick={() => onClose(current)}>Cancel</button>
            <button onClick={() => onClose(undefined)}>Clear</button>
          </div>
        </div>
        <div id="modal-lang" style={{ display: "flex", flexDirection: "column", alignItems: "center", height: 256 }}>
          <img
            src={`/aoc-cal/img/logo/${Global.pLangs[selected].code}.png`}
            style={{
              width: 256,
              height: "auto",
              filter: pngBorder(.2, "white")
            }}
          />
          <h3>Language references:</h3>
          <div id="modal-lang-refs" style={{maxWidth: 256}}>
          { Global.pLangs[selected].refs.map((r, i) => <Markdown key={i} children={r}/>) }
          </div>
        </div>
      </div>
    </ReactModal>
  );
}