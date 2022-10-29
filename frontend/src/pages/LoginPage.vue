<template>
  <b-container class="my-3">
    <div class="center">
      <h2>ברוכים הבאים לאתר המתכונים שלי</h2>
      <p>כאן תוכלו לשתף מתכונים שלכם ולצפות במתכונים אחרים</p>
    </div>
    <h3>{{ mode.text }}</h3>
    <b-form @submit="registerOrLogin">
      <b-form-group
        id="email"
        label="אימייל:"
        label-for="email"
        description="אנא הזן את האימייל שלך"
      >
        <b-form-input
          id="email"
          v-model="email"
          type="email"
          placeholder="אימייל"
          required
        ></b-form-input>
      </b-form-group>
      <label for="text-password">סיסמא:</label>
      <b-form-input
        type="password"
        id="text-password"
        v-model="password"
        aria-describedby="password-help-block"
        placeholder="סיסמא"
      ></b-form-input>
      <b-form-text id="password-help-block">
        אנא הזן סיסמא המורכבת לפחות מ6 תווים
      </b-form-text>
      <div v-if="mode.mode === 'register'">
        <b-form-group
          id="name"
          label="שם מלא:"
          label-for="name"
          description="אנא הזן שם מלא"
        >
          <b-form-input
            id="name"
            v-model="userName"
            type="text"
            placeholder="שם מלא"
            required
          ></b-form-input>
        </b-form-group>
        <p>
          כבר יש לך חשבון ? <span class="mode" @click="changeMode">התחבר</span>
        </p>
      </div>
      <div v-else>
        <p>
          משתמש חדש ? לחץ<span class="mode" @click="changeMode"> כאן</span>
          להרשמה
        </p>
      </div>
      <b-button type="submit" variant="primary">{{
        mode.mode === "register" ? "הרשם" : "התחבר"
      }}</b-button>
      <p v-if="error" class="text-danger">{{ error }}</p>
      <p v-if="userError" class="text-danger">{{ userError }}</p>
    </b-form>
  </b-container>
</template>

<script>
import Swal from "sweetalert2";
export default {
  data() {
    return {
      mode: { mode: "register", text: "הרשמה לאתר" },
      error: null,
    };
  },
  computed: {
    userError() {
      return this.$store.getters["users/userError"];
    },
    userLogin() {
      return this.$store.getters["users/userLogin"];
    },
  },
  watch: {
    mode() {
      return this.mode;
    },
  },
  created() {
    if (this.$store.getters["users/userLogin"]) {
      this.$router.replace("/");
    }
  },
  methods: {
    changeMode() {
      if (this.mode.mode === "register") {
        return (this.mode = { mode: "login", text: "התחברות משתמש קיים" });
      }
      if (this.mode.mode === "login") {
        return (this.mode = { mode: "register", text: "הרשמה לאתר" });
      }
    },
    async registerOrLogin() {
      const userEmail = this.email;
      const userPassword = this.password;
      if (userPassword.trim().length < 6) {
        return (this.error = "אנא הזן סיסמא המורכבת לפחות מ6 תווים !");
      }
      if (this.mode.mode === "register") {
        const userName = this.userName;
        if (userName.trim().length < 2) {
          return (this.error = "שם משתמש לא תקין !");
        } else {
          this.$store.dispatch("users/registerUser", {
            name: userName,
            email: userEmail,
            password: userPassword,
          });
          setTimeout(() => {
            if (this.userLogin?._id) {
              Swal.fire({
                icon: "success",
                title: "ההרשמה בוצעה בהצלחה !",
                showConfirmButton: false,
                timer: 1500,
              });
              this.$router.replace("/");
            }
          }, 2000);
        }
      } else {
        this.$store.dispatch("users/loginUser", {
          email: userEmail,
          password: userPassword,
        });
        setTimeout(() => {
          if (this.userLogin?._id) {
            Swal.fire({
              icon: "success",
              title: "ההתחברות בוצעה בהצלחה !",
              showConfirmButton: false,
              timer: 1500,
            });
            this.$router.replace("/");
          }
        }, 2000);
      }
    },
  },
};
</script>

<style scoped>
.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
.mode {
  text-decoration: underline;
  color: blue;
}
.mode:hover {
  color: rgb(82, 82, 158);
}
</style>
