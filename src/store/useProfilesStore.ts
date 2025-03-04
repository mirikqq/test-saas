import { defineStore } from 'pinia'
import type { Profile } from '../types/profiles.type'
import { ref, type Ref } from 'vue'

export const useProfileStore = defineStore('profiles', () => {
    const profiles: Ref<Profile[]> = ref([])

    const addProfile = () => {
        return profiles.value.push({
            mark: '',
            type: 'local',
            login: '',
            password: ''
        })
    }


    // profile should have a unique id, but its test task..
    const removeProfile = (index: number) => {
        return profiles.value.splice(index, 1)
    }

    return {
        profiles,
        addProfile,
        removeProfile
    }
})
