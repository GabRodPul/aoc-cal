import { useEffect, useState } from 'react'
import '~/App.css'
import { Global } from '~/Global'
import type { AocDay } from '~/types'
import { usePopupManager } from 'react-popup-manager'
import { EditModal } from '~/components/edit-modal/EditModal'
import { AocDayEntry } from '~/components/aoc-day-entry/AocDayEntry'

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
              <AocDayEntry day={days[i]} />
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
