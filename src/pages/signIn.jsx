import * as React from "react";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { auth } from "../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import animationData from "../assets/lottie/Aniki Hamster.json";
import Footer from "../components/footer";
import "../styles/logIn.css";

export default function SignIn() {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState("");

  const apiKey = process.env.REACT_APP_PEXELS_API_KEY;

  // Fetch video from Pexels API
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          "https://api.pexels.com/videos/search?query=technology&per_page=50",
          {
            headers: {
              Authorization: apiKey,
            },
          }
        );
        const videos = response.data.videos;
        if (videos.length > 0) {
          const randomVideo = videos[Math.floor(Math.random() * videos.length)];
          setVideoUrl(randomVideo.video_files[0].link);
          console.log("Vídeo carregado:", randomVideo.video_files[0].link);
        } else {
          console.log("Nenhum vídeo encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar vídeo do Pexels:", error);
      }
    };

    fetchVideo();
  }, [apiKey]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate("/homePage");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error creating account:", errorCode, errorMessage);
      });
  };

  return (
    <div>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {videoUrl && (
            <video
              autoPlay
              loop
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{ backgroundColor: " #908d96 " }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Lottie options={defaultOptions} height={100} width={100} />
            <Typography component="h1" variant="h5">
              Create account
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#46448C", // Cor da borda
                    },
                    "&:hover fieldset": {
                      borderColor: "#46448C", // Cor da borda ao passar o mouse
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#46448C", // Cor da borda quando o campo está focado
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#46448C", // Cor do label
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#46448C", // Cor do label quando o campo está focado
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "#FFFFFF", // Cor do texto
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#46448C", // Cor da borda
                    },
                    "&:hover fieldset": {
                      borderColor: "#46448C", // Cor da borda ao passar o mouse
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#46448C", // Cor da borda quando o campo está focado
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#46448C", // Cor do label
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#46448C", // Cor do label quando o campo está focado
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "#FFFFFF", // Cor do texto
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                type="password"
                label="Confirm your password again"
                id="passwordValidation"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#46448C", // Cor da borda
                    },
                    "&:hover fieldset": {
                      borderColor: "#46448C", // Cor da borda ao passar o mouse
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#46448C", // Cor da borda quando o campo está focado
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#46448C", // Cor do label
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#46448C", // Cor do label quando o campo está focado
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "#FFFFFF", // Cor do texto
                  },
                }}
              />
              <Button
                color="success"
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  borderRadius: 8,
                  backgroundColor: "#5855AE",
                  "&:hover": {
                    backgroundColor: "#46448C",
                  },
                }}
              >
                Create
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/" variant="body2" sx={{ color: "#382bf0" }}>
                    {"Already have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Footer />
    </div>
  );
}
