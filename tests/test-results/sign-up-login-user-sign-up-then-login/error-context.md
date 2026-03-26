# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: Créé un compte
      - generic [ref=e7]: Entrée vos informations ci-dessous pour créer un compte
    - generic [ref=e9]:
      - generic [ref=e10]:
        - group [ref=e11]:
          - generic [ref=e12]: Nom ou pseudo
          - textbox "Nom ou pseudo" [ref=e13]:
            - /placeholder: Gérard Bouchard
            - text: TestUser123
        - group [ref=e14]:
          - generic [ref=e15]: Email
          - textbox "Email" [ref=e16]: testuser@example.com
        - group [ref=e17]:
          - generic [ref=e19]: Mot de passe
          - textbox "Mot de passe" [ref=e20]: SecurePass123!
        - group [ref=e21]:
          - generic [ref=e22]: Confirmer le mot de passe
          - textbox "Confirmer le mot de passe" [ref=e23]: SecurePass123!
      - generic [ref=e24]:
        - button "Créer un compte" [active] [ref=e25]
        - paragraph [ref=e26]: Il y a une erreur dans la création du compte, essayez à nouveau plus tard
        - button "S'inscrire avec Google" [ref=e27]
        - paragraph [ref=e28]:
          - text: Vous avez déjà un compte ?
          - link "Se connecter" [ref=e29] [cursor=pointer]:
            - /url: /login
  - button "Open Next.js Dev Tools" [ref=e35] [cursor=pointer]:
    - img [ref=e36]
  - alert [ref=e39]
```