import { Lesson } from "../../domain/Entities/Lesson"
import { Sport } from "../../domain/type"
import { PostgreSQLResult } from "./dBtoEntityMapping"

interface LessonDBwithInstructionRow {
  lesson_id: number
  title: string
  sport: Sport
  objective: string
  created_at: Date
  user_id: number
  text: string
  type: string
  min: number
  sec: number
  order: number
}

export const dbtoEntityMappingGetAll = (
  lessonsDB: PostgreSQLResult<LessonDBwithInstructionRow>
): Lesson[] => {
  const map = new Map() // key lessonId, property : object
  // pour chaque ligne avec un identifiant lesson
  for (const lessonDB of lessonsDB.rows) {
    // voir si la lesson existe dans la hashmap
    const lessonMap = map.get(lessonDB.lesson_id)
    //    si existe pas créé
    if (!lessonMap) {
      const { lesson_id, user_id, title, sport, objective, created_at } =
        lessonDB
      const lessonTemp = {
        lessonId: lesson_id,
        userId: user_id,
        title,
        objective,
        creationDate: new Date(created_at),
        sport: sport as Sport,
      }
      const lessonForMap = addInstructions(lessonTemp, lessonDB)
      map.set(lessonDB.lesson_id, lessonForMap)
    } else {
      //    si existe lesson existe
      const lessonForMap = addInstructions(lessonMap, lessonDB)
      map.set(lessonDB.lesson_id, lessonForMap)
    }
  }
  const res: Lesson[] = []
  for (const value of map) {
    res.push(value[1])
  }
  return res

  //      regarder si le type d'instruction existe
  //        si existe pas créé
  //        si existe alors ajoutée au tableau
  // aller chercher dans la liste des instructions celle qui correspond à l'id de la lesson
  // construire l'objet lesson à partir de ce informations et le mettre dans un tableau
}

// est-ce qu'il est possible de chercher les colonnes par leurs nom et non par leurs chiffre ?

export const addInstructions = (
  lesson: Partial<Lesson>,
  lessonDBwithInstructionRow: LessonDBwithInstructionRow
): Partial<Lesson> => {
  const res: Partial<Lesson> = { ...lesson }
  const { text, type, min, sec, order } = lessonDBwithInstructionRow
  switch (type) {
    case "body": {
      if (res.bodyInstructions) {
        res.bodyInstructions.push({ text, min, sec, order })
      } else {
        res.bodyInstructions = [{ text, min, sec, order }]
      }
      break
    }
    case "warmUp": {
      if (res.warmUpInstructions) {
        res.warmUpInstructions.push({ text, min, sec, order })
      } else {
        res.warmUpInstructions = [{ text, min, sec, order }]
      }
      break
    }
    case "coolDown": {
      if (res.coolDownInstructions) {
        res.coolDownInstructions.push({ text, min, sec, order })
      } else {
        res.coolDownInstructions = [{ text, min, sec, order }]
      }
      break
    }
  }
  return res
}

// const mockLesson.rows= [
//     {
//       lesson_id: 4,
//       title: 'MMA cardio',
//       sport: 'MMA',
//       objective: 'Améliorer endurance et explosivité',
//       created_at: 2026-03-16T05:44:37.164Z,
//       user_id: 3,
//       text: 'Combinaisons pieds-poings intensives',
//       type: 'body',
//       min: 5,
//       sec: 0,
//       order: 1
//     },
//     {
//       lesson_id: 4,
//       title: 'MMA cardio',
//       sport: 'MMA',
//       objective: 'Améliorer endurance et explosivité',
//       created_at: 2026-03-16T05:44:37.164Z,
//       user_id: 3,
//       text: 'Entrées de jambes répétées',
//       type: 'body',
//       min: 5,
//       sec: 0,
//       order: 2
//     },
//     {
//       lesson_id: 4,
//       title: 'MMA cardio',
//       sport: 'MMA',
//       objective: 'Améliorer endurance et explosivité',
//       created_at: 2026-03-16T05:44:37.164Z,
//       user_id: 3,
//       text: 'Enchaînement pompes-squats-abdos',
//       type: 'body',
//       min: 6,
//       sec: 0,
//       order: 3
//     },
//     {
//       lesson_id: 4,
//       title: 'MMA cardio',
//       sport: 'MMA',
//       objective: 'Améliorer endurance et explosivité',
//       created_at: 2026-03-16T05:44:37.164Z,
//       user_id: 3,
//       text: 'Marche lente pour récupérer',
//       type: 'coolDown',
//       min: 3,
//       sec: 0,
//       order: 1
//     },
//     {
//       lesson_id: 4,
//       title: 'MMA cardio',
//       sport: 'MMA',
//       objective: 'Améliorer endurance et explosivité',
//       created_at: 2026-03-16T05:44:37.164Z,
//       user_id: 3,
//       text: 'Étirer tous les groupes musculaires sollicités',
//       type: 'coolDown',
//       min: 5,
//       sec: 0,
//       order: 2
//     }
//   ],
