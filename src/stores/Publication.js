import { defineStore } from 'pinia';

export const usePublicationStore = defineStore('publicationdb', {
  state: () => ({
    type: [],
    activeButton: 1, // 預設顯示按鈕
  }),
  actions: {
    updateType(newType) {
      this.type = newType;
    },
    setActiveButton(buttonId) {
      this.activeButton = buttonId;
    },
  },
});