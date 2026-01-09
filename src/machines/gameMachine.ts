import { setup, assign } from 'xstate';

// Define the context type
interface GameContext {
  isLoggedIn: boolean;
  categorySelected?: string;
  roomId?: string;
}

// Define the events
type GameEvent =
  | { type: 'PLAY' }
  | { type: 'CHOOSE_ROOM' }
  | { type: 'JOIN_ROOM'; roomId: string }
  | { type: 'LOGIN' }
  | { type: 'START_GAME'; categorySelected: string }
  | { type: 'FINISH_GAME' }
  | { type: 'BACK_TO_HOME' }
  | { type: 'BACK_TO_CHOOSE_ROOM' };

// Define the machine
export const gameMachine = setup({
  types: {
    context: {} as GameContext,
    events: {} as GameEvent,
  },
  guards: {
    isLoggedIn: ({ context }) => {
      return context.isLoggedIn === true;
    },
    isNotLoggedIn: ({ context }) => {
      return context.isLoggedIn === false;
    },
  },
  actions: {
    setLoggedIn: assign({
      isLoggedIn: true,
    }),
    setRoomId: assign({
      roomId: ({ event }) => {
        if (event.type === 'JOIN_ROOM') {
          return event.roomId;
        }
        return undefined;
      },
    }),
    setCategorySelected: assign({
      categorySelected: ({ event }) => {
        if (event.type === 'START_GAME') {
          return event.categorySelected;
        }
        return undefined;
      },
    }),
    resetGameContext: assign({
      categorySelected: undefined,
      roomId: undefined,
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoAWB7DAxAAoAyAggJoDaADALqKgAOusAlgC5u4B2jIAD0QAWAEwAOTOIkBGAMxz5NcQE4FAGhABPRKICsozAHZhKs8JpnZagL43NqDJgDGeVmABKufAQBSAeQBJADkAfQ9-fwBZWgYkEBZ2Ll5+IQQANhkVTHS5CVFFZVFhOSNNHQRFdMwZUxUjIxk9JRo9dLsHdCxXb1hPbzQ-ILCI6KoZOOZWTm4+eLSVS0xRGkVhIzlLURl08XLEOTaalTF07frCmQ6QR263Pq8fEn8AcRDY-kSZlPnEdMXMHoaEZxJsZKIjCoDGVtLosoDGuIDHIVE0SkZ2vYbl0XPd+j4AEJkADCAGlQgAVfyhAAS0QAoh94l9knNQGkxJJpOJ5IpNqoNLCECtDMUzCpxKCQTIGkZrrdMGweI9BgBlClkDwU0IvMhRRn0T7TVmpRDyAo5cRGZH1EyS9L7SpAnIySxySU7CSrYTynFKlUEIlkynU4l0-yq+nhSIxQ3M42zU0IKHVVQ0dLCPR8poQx2bPQ5E6idL-Q7iTMqX1OJgAGxQWiVUAIADEQoFVTSdXqDZMEgmfuyzXIzjlLMJXXoMRLRI6eYCaAuaODgco2pWsQqAGZKtiwbCBknkqm0hlMqZJRO-BC1GiYYSZwpZrOQ3KO0TbHIQvSozaLUQqdI5Q3HFtx4Xd91ISgzz7C8B0EM0LDvB8J0OUoALkPNnWEdItn+cRlEAoCsR4XAIDgfhbiNWC2XghAAFoHSFBjMEXVi2KXH1gKcPAMCo74aLSPJsh5fRlAlSxETfTMahLXIUz0b9VirO5enxNA+JNK9-lvFR-3+E5rXEQC9iFUoZByOojGKcEMXWZTFWVAYNMvQdr22AskSaJEGgUd8MNMkwaiBVYUPTAD7NretG2cuC0hzaojBCoE7XLEyKmHSQ2hLUwQo2PR7NA8CYoEkQZyFYpDFkuS2gUv85DsOwgA */
  id: 'game',
  initial: 'home',
  context: {
    isLoggedIn: false,
    categorySelected: undefined,
    roomId: undefined,
  },
  states: {
    home: {
      on: {
        PLAY: {
          target: 'chooseRoom',
        },
      },
    },
    chooseRoom: {
      on: {
        JOIN_ROOM: [
          {
            guard: 'isNotLoggedIn',
            target: 'chooseRoom',
            // Stay in chooseRoom if not logged in
            // You might want to show a message or trigger login here
          },
          {
            guard: 'isLoggedIn',
            target: 'inRoom',
            actions: 'setRoomId',
          },
        ],
        LOGIN: {
          actions: 'setLoggedIn',
        },
        BACK_TO_HOME: {
          target: 'home',
        },
      },
    },
    inRoom: {
      on: {
        START_GAME: {
          target: 'playing',
          actions: 'setCategorySelected',
        },
        BACK_TO_CHOOSE_ROOM: {
          target: 'chooseRoom',
        },
      },
    },
    playing: {
      on: {
        FINISH_GAME: {
          target: 'finish',
        },
      },
    },
    finish: {
      on: {
        BACK_TO_HOME: {
          target: 'home',
          actions: 'resetGameContext',
        },
        PLAY: {
          target: 'chooseRoom',
          actions: 'resetGameContext',
        },
      },
    },
  },
});
