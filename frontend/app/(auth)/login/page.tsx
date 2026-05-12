"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FieldGroup } from "@/components/ui/field"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { Form } from "@/components/lessonForm/Form"
import { EmailField } from "@/components/lessonForm/EmailField"
import { PasswordField } from "@/components/lessonForm/PasswordField"
import Link from "next/link"
import { useLoginMutation } from "@/store/api/userAPI"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { BackendError } from "@/types"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"

export default function Page() {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Veuillez entrer une adresse email valide")
      .required("L'email est requis")
      .max(254, "L'email ne peut pas dépasser 254 caractères"),
    password: Yup.string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .max(64, "Le mot de passe ne peut pas dépasser 64 caractères")
      .required("Le mot de passe est requis"),
  })

  type FormData = Yup.InferType<typeof validationSchema>

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    mode: "onSubmit",
  })

  const [login, { isLoading, error, isSuccess, data: loginData }] =
    useLoginMutation()
  const errorMessage = getErrorMessage(error as BackendError)
  const { saveAuth } = useAuth()
  const router = useRouter()
  const { executeRecaptcha } = useGoogleReCaptcha()

  const onValid = async (data: FormData) => {
    if (!executeRecaptcha) {
      console.error("reCAPTCHA not ready")
      return
    }

    const recaptchaToken = await executeRecaptcha("login")
    await login({ ...data, recaptchaToken })
  }

  useEffect(() => {
    if (isSuccess && loginData) {
      saveAuth(loginData.token, loginData.userId)
      setTimeout(() => {
        router.push("/lessons")
      }, 1000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, loginData])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Connectez-vous à votre compte</CardTitle>
            <CardDescription>
              Entrez votre email ci-dessous pour vous connecter à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form onSubmit={handleSubmit(onValid)}>
              <FieldGroup>
                <EmailField register={register} errors={errors} />
                <PasswordField
                  register={register}
                  errors={errors}
                  showForgotPassword={true}
                />
              </FieldGroup>
              <div className="flex flex-col gap-3 pt-8">
                <Button type="submit">
                  {isLoading ? "Chargement" : "Se connecter"}
                </Button>
                {error && (
                  <p className="text-center font-medium red text-sm text-[red]">
                    {errorMessage}
                  </p>
                )}
                {isSuccess && (
                  <p className="text-center font-medium text-sm text-green-600">
                    Connexion réussie ! Bienvenue.
                  </p>
                )}
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => alert("Pas disponible pour le moment")}
                >
                  Se connecter avec Google
                </Button>
                <p className="text-center text-sm">
                  Vous n&apos;avez pas de compte ?{" "}
                  <Link href="/sign-up">S&apos;inscrire</Link>
                </p>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
