<script setup lang="ts">
import { ElButton, ElInput, ElSelect, ElOption } from 'element-plus';
import { useProfileStore } from './store/useProfilesStore';
import type {Profile} from "./types/profiles.type.ts";

const store = useProfileStore();

const handleMarkInput = (value: string, profile: Profile): void => {
    value = value.replace(/[^a-zA-Zа-яА-ЯёЁ0-9 ;]/g, "").replace(/\s+/g, " ");

    if (value.length > 50) {
        value = value.substring(0, 50);
    }

    profile.parsedMarks = value
        .split(";")
        .map(item => item.trim())
        .filter(item => item.length > 0)
        .map(text => ({ text }));
};

</script>

<template>
    <div class="profiles-wrapper">
        <div class="profiles-header">
            <h1>Учетная запись</h1>
            <ElButton @click="store.addProfile()">+</ElButton>
        </div>
        <div class="profiles-tooltip">
            <span class="profile-tooltip_icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <g fill="none" stroke="black" stroke-linecap="round">
                        <path stroke-miterlimit="10" stroke-width="1.5"
                            d="M9.008 8.84a3.185 3.185 0 0 1 3.471-1.806a3.09 3.09 0 0 1 2.265 1.614a2.682 2.682 0 0 1-1.562 3.689a1.98 1.98 0 0 0-1.276 1.787v.738" />
                        <path stroke-linejoin="round" stroke-width="2" d="M11.881 17.424h.008" />
                        <path stroke-linejoin="round" stroke-width="1.5"
                            d="M12 21.5a9.5 9.5 0 1 0 0-19a9.5 9.5 0 0 0 0 19" />
                    </g>
                </svg>
            </span>
            <p>Для указания нескольких методов для одной пары логин/пароль используйте разделитель ;</p>
        </div>
        <div class="profiles">
            <div class="profiles-titles">
                <span>Метки</span>
                <span>Тип записи</span>
                <span>Логин</span>
                <span>Пароль</span>
            </div>
            <div class="profiles-data">
                <div class="profile-data" v-for="(profile, index) in store.profiles">
                    <ElInput :maxlength="50" @input="(value) => handleMarkInput(value, profile)" v-model="profile.mark" placeholder="Значение" />
                    <ElSelect v-model="profile.type">
                        <ElOption label="LDAP" value="ldap"></ElOption>
                        <ElOption label="Local" value="local"></ElOption>
                    </ElSelect>
                    <ElInput type="text" :maxlength="100" placeholder="Значение" v-model="profile.login" />
                    <ElInput type="password" placeholder="Значение" v-if="profile.type === 'local'" :maxlength="100" v-model="profile.password" />
                    <ElButton class="profile-remove" @click="store.removeProfile(index)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                            <path fill="#000000"
                                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                    </ElButton>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.profiles-wrapper {
    display: flex;
    margin: 10rem;
    flex-direction: column;
    gap: .5rem;

    .profiles-header,
    .profiles-tooltip {
        display: inline-flex;
        align-items: center;
        gap: .5rem;
    }

    .profiles-tooltip {
        background-color: #e3efff;
        padding: .25rem .5rem;
    }

    .profiles {
        display: flex;
        flex-direction: column;
    }

    .profiles {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .profiles-titles,
    .profile-data {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
    }

    .profiles-titles {
        font-weight: bold;
        text-align: center;
    }

    .profile-data {
        position: relative;

        .profile-remove {
            position: absolute;
            right: -4rem;

            & svg {
                height: 1.5rem;
                width: 1.5rem;
            }
        }
    }

}
</style>
