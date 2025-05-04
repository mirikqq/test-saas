import { defineStore } from 'pinia'
import type { Profile } from '../types/profiles.type'
import { ref, type Ref, computed } from 'vue'

export const useProfileStore = defineStore('profiles', () => {
    const profiles: Ref<Profile[]> = ref([]);
    const errors: Ref<Record<number, Partial<Record<RequiredField, boolean>>>> = ref({});

    const addProfile = () => {
        return profiles.value.push({
            mark: '',
            type: 'local',
            login: '',
            password: ''
        });
    };

    const requiredFields = ["login", "password"] as const;
    type RequiredField = typeof requiredFields[number];

    const validationRules: Record<RequiredField, { minLength: number; maxLength: number }> = {
        login: { minLength: 1, maxLength: 100 },
        password: { minLength: 1, maxLength: 100 }
    };

    const validateFields = (profile: Profile, index: number) => {
        const newErrors: Partial<Record<RequiredField, boolean>> = {};

        requiredFields.forEach((field) => {
            const value = profile[field];
            const rules = validationRules[field];

            if (field === "password" && profile.type === "ldap") return

            const isInvalid = typeof value !== 'string'
                || value.length < rules.minLength
                || value.length > rules.maxLength;

            if (isInvalid) newErrors[field] = true;
        });

        errors.value[index] = newErrors;
        return { invalidFields: Object.keys(newErrors) };
    };

    const removeProfile = (index: number) => {
        return profiles.value.splice(index, 1);
    };

    const validProfiles = computed(() => {
        return profiles.value.filter((_, index) => {
            const profileErrors = errors.value[index];
            return !Object.keys(profileErrors || {}).length; // Проверяем на отсутствие ошибок
        });
    });

    return {
        profiles,
        validProfiles,
        addProfile,
        removeProfile,
        validateFields,
        errors
    };
}, {
    persist: {
        key: 'profiles',
        storage: localStorage,
        serializer: {
            serialize: (state) => {
                const validProfiles = state.profiles.filter((_: Profile, index: number) => {
                    const errors = state.errors?.[index];
                    return !errors || Object.keys(errors).length === 0;
                });
                return JSON.stringify({ profiles: validProfiles });
            },
            deserialize: (value) => {
                const parsed = JSON.parse(value);
                return {
                    profiles: parsed.profiles || [],
                    errors: {}
                };
            }
        }
    }
});
