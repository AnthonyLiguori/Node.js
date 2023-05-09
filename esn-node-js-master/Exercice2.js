function resolveAfter3Seconds() {
  setTimeout(() => {
    resolve("3 secondes");
  }, 3000);
}

function resolveAfter3SecondsDePLus() {
  setTimeout(() => {
    resolve("3 secondes de plus");
  }, 3000);
}

function call() {
  console.log("Début");
  resolveAfter3Seconds();
  resolveAfter3SecondsDePLus();
  console.log("Terminé");
}

call();
