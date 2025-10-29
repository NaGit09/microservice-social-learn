<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { AutoForm } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'
import type { loginReq } from '@/types/auth/auth'
import { FacebookIcon } from 'lucide-vue-next'
import { router } from '@/router'

const { accessToken, login } = useAuthStore()

const emit = defineEmits(['toggle'])

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const form = useForm({
  validationSchema: toTypedSchema(schema),
})

async function onSubmit(values: Record<string, any>) {
  const email = values.email as string
  const password = values.password as string

  const loginObj: loginReq = { email: email, password: password }
  
  await login(loginObj)
  if (accessToken) {
    router.push('/')
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="text-4xl">Social-learn</h1>
    <AutoForm
      class="w-2xs text-gray-300 space-y-6"
      :schema="schema"
      :form="form"
      @submit="onSubmit"
      :field-config="{
        email: {
          hideLabel: true,
          inputProps: {
            type: 'text',
            placeholder: 'Enter your email',
          },
        },
        password: {
          hideLabel: true,

          inputProps: {
            type: 'password',
            placeholder: 'Enter your password',
          },
        },
      }"
    >
      <Button class="w-xs space-y-6 bg-blue-600" type="submit"> Login </Button>
      <div class="w-80 flex items-center justify-center">
        <hr class="w-40" />
        <span class="mx-4">OR</span>
        <hr class="w-40" />
      </div>
      <div class="w-80 flex items-center justify-center gap-2 text-blue-400">
        <FacebookIcon />
        <a class="text-blue-400 no-underline" href="https://www.facebook.com/"
          >Login with facebook</a
        >
      </div>
      <p class="text-center w-80">
        Don't have an account yet ?
        <a
          @click="emit('toggle')"
          class="top-layout w-90 mx-2 no-underline text-blue-600"
        >
          Register
        </a>
      </p>
    </AutoForm>
  </div>
</template>
<style></style>
