# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: Connectez-vous à votre compte
      - generic [ref=e7]: Entrez votre email ci-dessous pour vous connecter à votre compte
    - generic [ref=e9]:
      - generic [ref=e10]:
        - group [ref=e11]:
          - generic [ref=e12]: Email
          - textbox "Email" [ref=e13]: testuser@example.com
        - group [ref=e14]:
          - generic [ref=e15]:
            - generic [ref=e16]: Mot de passe
            - link "Mot de passe oublié ?" [ref=e17] [cursor=pointer]:
              - /url: /404
          - textbox "Mot de passe" [ref=e18]: SecurePass123!
      - generic [ref=e19]:
        - button "Se connecter" [active] [ref=e20]
        - paragraph [ref=e21]: Aucun compte utilisateur trouvé avec cet email
        - button "Se connecter avec Google" [ref=e22]
        - paragraph [ref=e23]:
          - text: Vous n'avez pas de compte ?
          - link "S'inscrire" [ref=e24] [cursor=pointer]:
            - /url: /sign-up
  - button "Open Next.js Dev Tools" [ref=e30] [cursor=pointer]:
    - img [ref=e31]
  - alert [ref=e34]
```