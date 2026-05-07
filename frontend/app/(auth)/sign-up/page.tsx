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
import { useForm } from "react-hook-form"
import * as Yup from "yup"
import { Form } from "@/components/lessonForm/Form"
import { EmailField } from "@/components/lessonForm/EmailField"
import { PasswordField } from "@/components/lessonForm/PasswordField"
import { ConfirmPasswordField } from "@/components/lessonForm/ConfirmPasswordField"
import { NameField } from "@/components/lessonForm/NameField"
import Link from "next/link"
import { useSignUpMutation } from "@/store/api/userAPI"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect } from "react"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"

export default function SignUp() {
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Le nom doit contenir au moins 3 caractères")
      .max(20, "Le nom ne peut pas dépasser 20 caractères")
      .required("Le nom est requis"),
    email: Yup.string()
      .email("Veuillez entrer une adresse email valide")
      .max(128, "L'email ne peut pas dépasser 128 caractères")
      .required("L'email est requis"),
    password: Yup.string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .max(64, "Le mot de passe ne peut pas dépasser 64 caractères")
      .required("Le mot de passe est requis"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Les mots de passe ne correspondent pas")
      .required("Veuillez confirmer votre mot de passe"),
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

  const [signUp, { isLoading, error, isSuccess, data: signUpData }] =
    useSignUpMutation()
  const { login: saveAuth } = useAuth()
  const router = useRouter()
  const { executeRecaptcha } = useGoogleReCaptcha()

  const onValid = async (data: FormData) => {
    if (!executeRecaptcha) {
      console.error("reCAPTCHA not ready")
      return
    }

    const recaptchaToken = await executeRecaptcha("signup")
    await signUp({ ...data, recaptchaToken })
  }

  useEffect(() => {
    if (isSuccess && signUpData) {
      saveAuth(signUpData.token, signUpData.userId)
      router.push("/lessons/user")
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps*/
  }, [isSuccess, signUpData])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Créé un compte</CardTitle>
            <CardDescription>
              Entrée vos informations ci-dessous pour créer un compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form onSubmit={handleSubmit(onValid)}>
              <FieldGroup>
                <NameField register={register} errors={errors} />
                <EmailField register={register} errors={errors} />
                <PasswordField register={register} errors={errors} />
                <ConfirmPasswordField register={register} errors={errors} />
              </FieldGroup>
              <div className="flex flex-col gap-3 pt-8">
                <Button type="submit">
                  {isLoading ? "Chargement..." : "Créer un compte"}
                </Button>
                {error && (
                  <p className="text-center font-medium red text-sm text-[red]">
                    {error.data?.error}
                  </p>
                )}
                <Button variant="outline" type="button">
                  S&apos;inscrire avec Google
                </Button>
                <p className="px-6 text-center">
                  Vous avez déjà un compte ?{" "}
                  <Link href="/login">Se connecter</Link>
                </p>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
