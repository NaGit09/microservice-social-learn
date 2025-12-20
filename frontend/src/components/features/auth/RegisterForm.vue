<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { AutoForm } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth.store'
import { FacebookIcon } from 'lucide-vue-next'
import type { registerReq } from '@/types/auth.type'
import { toast } from 'vue-sonner'

const { register } = useAuthStore()
const emit = defineEmits(['toggle', 'register'])

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
  fullname: z.string(),
  username: z.string(),
})

const form = useForm({
  validationSchema: toTypedSchema(schema),
})

async function onSubmit(values: Record<string, any>) {
  const email = values.email as string
  const password = values.password as string
  const username = values.username as string
  const fullname = values.fullname as string

  const userRegister: registerReq = {
    email: email,
    password: password,
    username: username,
    fullname: fullname,
  }
  
  const registed = await register(userRegister)

  if (registed) {
    toast.success('Register a new account successfully !')
    emit('toggle')
  } else {
    toast.error('Register a new account failed !')
  }
}
</script>

<template>
  <div class="container flex flex-col items-center justify-center">
    <h1 class="text-4xl dark:text-gray-200">Social-learn</h1>
    <AutoForm class="w-2xs space-y-6" :schema="schema" :form="form" @submit="onSubmit" :field-config="{
        email: {
          hideLabel: true,
          inputProps: {
            type: 'text',
            class: 'dark:border-gray-50 dark:text-gray-50 ',
            placeholder: 'Nhập email',
            autocomplete: 'current-email'

          },
        },
        password: {
          hideLabel: true,
          inputProps: {
            type: 'password',
            class: 'dark:border-gray-50 dark:text-gray-50',
            placeholder: 'Nhập mật khẩu',
            autocomplete: 'current-password'

          },
        },
        username: {
          hideLabel: true,
          inputProps: {
            type: 'text',
            class: 'dark:border-gray-50 dark:text-gray-50',
            placeholder: 'Nhập tên người dùng',
            autocomplete: 'current-username'

          },
        },
        fullname: {
          hideLabel: true,
          inputProps: {
            type: 'text',
            class: 'dark:border-gray-50 dark:text-gray-50',
            placeholder: 'Nhập tên đầy đủ',
            autocomplete: 'current-fullname'

          },
        },
      }">
      <Button class="w-xs space-y-6 bg-blue-500 hover:bg-blue-600 text-gray-50" type="submit">
        Đăng ký
      </Button>
      <div class="w-80 flex items-center justify-center">
        <hr class="w-40" />
        <span class="mx-4 dark:text-gray-50">OR</span>
        <hr class="w-40" />
      </div>
      <div class="w-80 flex items-center justify-center gap-2">
        <FacebookIcon class="dark:text-gray-50" />
        <a class="no-underline text-blue-600" href="https://www.facebook.com/">Đăng nhập với Facebook</a>
      </div>
      <p class="text-center w-80 cursor-pointer dark:text-gray-50">
        Bạn đã có tài khoản chưa ?
        <a @click="emit('toggle')" class="top-layout w-90 mx-2 no-underline">
          Đăng nhập
        </a>
      </p>
    </AutoForm>
  </div>
</template>
<style></style>
