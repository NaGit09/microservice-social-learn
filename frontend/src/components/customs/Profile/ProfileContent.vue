<script setup lang="ts">
import { computed, ref } from 'vue'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { Profile } from '@/types/user.type'
import { toast } from 'vue-sonner'
import Follow from '../features/Follow.vue'
import { useFollowStore } from '@/stores/follow.store'
import { storeToRefs } from 'pinia'

const prop = defineProps<{
  userId: string
  checkOwner: boolean
  profile: Profile
  updateProfile: (dto: Profile) => Promise<void>
}>()
const useFollow = useFollowStore()
const { follow } = storeToRefs(useFollow)
const major = ref(prop.profile.major)
const school = ref(prop.profile.school)
const hobbies = ref(prop.profile.hobbies)
const hometown = ref(prop.profile.hometown)
const year = ref(prop.profile.year)
const className = ref(prop.profile.className)
const handleSubmit = async () => {
  const newProfile: Profile = {
    id: prop.profile.id,
    school: school.value,
    year: year.value,
    hometown: hometown.value,
    className: className.value,
    hobbies: hobbies.value,
    major: major.value,
  }

  await prop.updateProfile(newProfile)

  toast.success('Update profile successfully !')
}

const hobbiesAsText = computed({
  get() {
    return (prop.profile?.hobbies ?? []).join('\n')
  },
  set(value) {
    if (!prop.profile) {
      return
    }

    hobbies.value = value
      .split('\n')
      .map((h) => h.trim())
      .filter((h) => h.length > 0)
  },
})

const displayButton = computed(() => {
  if (follow.value === null) {
    return 'follow'
  } else if (follow.value.status === 'ACCEPTED') {
    return 'unfollow'
  } else {
    return 'handle'
  }
})
</script>

<template>
  <div class="space-y-4 rounded-md border p-4 shadow dark:border-gray-400 mt-5">
    <div v-if="displayButton === 'follow'">
      <Follow
        :id="follow?.id != null ? String(follow.id) : ''"
        :targetId="String(userId)"
        :requestId="String(profile.id)"
        :status="displayButton"
        v-if="checkOwner"
      />
    </div>
    <div v-else-if="displayButton === 'unfollow'">
      <Follow
        :id="follow?.id != null ? String(follow.id) : ''"
        :targetId="String(userId)"
        :requestId="String(profile.id)"
        :status="displayButton"
        v-if="checkOwner"
      />
    </div>
    <div v-else>
      <Follow
        :id="follow?.id != null ? String(follow.id) : ''"
        :targetId="userId"
        :requestId="profile.id"
        status="accept"
        v-if="checkOwner"
      />
      <Follow
        :id="follow?.id != null ? String(follow.id) : ''"
        :targetId="userId"
        :requestId="profile.id"
        status="reject"
        v-if="checkOwner"
      />
    </div>
    <h2 class="text-xl font-semibold text-white">Thông tin sinh viên</h2>

    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 dark:text-white"
    >
      <div class="space-y-2">
        <Label for="school">Trường học</Label>
        <Input
          :disabled="checkOwner"
          id="school"
          v-model="school"
          class="dark:text-white max-w-[250px]"
        />
      </div>

      <div class="space-y-2">
        <Label for="major">Chuyên ngành</Label>
        <Input
          :disabled="checkOwner"
          id="major"
          v-model="major"
          class="dark:text-white max-w-[250px]"
        />
      </div>

      <div class="space-y-2">
        <Label for="className">Lớp</Label>
        <Input
          :disabled="checkOwner"
          id="className"
          v-model="className"
          class="dark:text-white max-w-[250px]"
        />
      </div>

      <div class="space-y-2">
        <Label for="year">Năm học</Label>
        <Input
          :disabled="checkOwner"
          id="year"
          type="number"
          v-model.number="year"
          class="dark:text-white max-w-[250px]"
        />
      </div>

      <div class="space-y-2">
        <Label for="hometown">Quê quán</Label>
        <Input
          :disabled="checkOwner"
          id="hometown"
          v-model="hometown"
          class="dark:text-white max-w-[250px]"
        />
      </div>
      <div class="space-y-2 mr-2 col-span-1 md:col-span-2 lg:col-span-4">
        <Label for="hobbies">Sở thích</Label>
        <Textarea
          :disabled="checkOwner"
          class="dark:text-white max-w-[90%]"
          id="hobbies"
          v-model="hobbiesAsText"
          placeholder="Nhập mỗi sở thích trên một dòng..."
          rows="4"
        />
      </div>
    </div>
    <Button
      :disabled="checkOwner"
      class="text-white bg-blue-500 hover:bg-blue-900"
      @Click="handleSubmit"
      >Lưu thông tin
    </Button>
  </div>
</template>
