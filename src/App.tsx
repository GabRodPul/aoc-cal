import { useEffect, useState } from 'react'
import './App.css'
import { Global } from './Global'
import type { AocDay } from './types'
import { usePopupManager } from 'react-popup-manager'
import ReactModal from 'react-modal'
import Markdown from 'react-markdown'

// TODO: Could this project be organised and commented better? Absolutely.
// But I'll do it once I feel like adapting it to all AoC versions.

// const pngBorder = (border: number, color: string) => `
//     drop-shadow( ${border}px  ${border}px 0 ${color})
//     drop-shadow(-${border}px  ${border}px 0 ${color})
//     drop-shadow( ${border}px -${border}px 0 ${color})
//     drop-shadow(-${border}px -${border}px 0 ${color})
//   `;
const pngBorder = (border: number, color: string) => `
       drop-shadow( ${border}px  ${border}px 0 ${color})
    `;

const AocDayEntry = ({ day }: { day: AocDay }) => {
  
  return day ? (
    <div>
      <img
        src={`/img/logo/${day.lang.code}.png`}
        style={{
          maxWidth: "64px",
          filter: pngBorder(.2, "white")
        }}
      />
      <p>{day.lang.name}</p>
      <p>Answer 1: {day.answer1}</p>
      <p>Answer 2: {day.answer2}</p>
    </div>
  )
    : (<p>Not solved</p>);
}

// @ts-expect-error Ignore this any
const EditModal = ({ isOpen, onClose, current, index }) => {
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
            src={`/img/logo/${Global.pLangs[selected].code}.png`}
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

function App() {
  const nums = [...Array(32).keys()].slice(1);
  const [days, setDays] = useState<Array<AocDay | undefined>>(() => {
      const d = localStorage.getItem(Global.storageKeyDays);
      console.debug(d)
      return d !== null ? JSON.parse(d)
               : Array(Global.aocDayCount).fill(undefined);
    });

  const [time, setTime] = useState(() => Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const popupManager = usePopupManager();

  // const handleEdit = (_: number) => {}
  const handleEdit = async (index: number) => {
    const { response } = popupManager.open(EditModal, { current: days[index], index, onClose: undefined });
    const result = await response as AocDay;
    const newDays = days.slice(0);
    newDays[index] = result;
    setDays(newDays);
    localStorage.setItem(Global.storageKeyDays, JSON.stringify(newDays));
  };

  const dayNotAvailable = (n: number) => time < Date.UTC(2025, 11, n, 5);

  // TODO: Make the whole app compatible with all AoC editions
  return (
    <>
      <h2>AoC 2025</h2>
      <div style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        flexGrow: 7
      }}>{nums.map((n, i) => n <= Global.aocDayCount ?
        <button key={i}
          style={{
            flexBasis: (100 / 7) + "%",
            minHeight: 270
          }}
          disabled={dayNotAvailable(n)}
          onClick={() => handleEdit(i)}
        >
          <p>{n}</p>
          {dayNotAvailable(n)
            ? <div style={{ color: "ff" }}>Locked</div>
            : <div>
              {days[i] !== undefined
                ? <AocDayEntry day={days[i]} />
                : <div>Not done</div>}
            </div>
          }
        </button>
        :
        <button key={i} style={{
          flexBasis: (100 / 7) + "%",
          minHeight: 100,
          pointerEvents: "none"
        }}>
          <p>{n}</p>
        </button>)
        }</div>

    </>
  )
}

export default App
